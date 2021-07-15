import {useContext, useEffect, useState} from 'react';
import { useId } from '@fluentui/react-hooks';
import {
  mergeStyleSets,
  FontWeights,
  Modal,
  IIconProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { Steps } from 'antd';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { LoadingOutlined,ReloadOutlined,CloseCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Utils,ChainEventBase, ChainEventStatus } from 'types';
import { AnyAction, Dispatch } from "redux";
import { useDispatch, useSelector } from 'react-redux';
import { ChainEventItem } from 'common-containers/dist/chain/ChainEventItem';
import { BridgeClient } from "./../clients/BridgeClient";
import { inject} from 'types';
import {SidePanelSlice} from './../components/SidePanel';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { UnifyreExtensionWeb3Client,CurrencyList } from 'unifyre-extension-web3-retrofit';
import {connectSlice} from "common-containers";
import { CommonActions,addAction } from './../common/Actions';
import { BridgeAppState } from './../common/BridgeAppState';
import { SidePanelProps } from './../components/SidePanel';
import { MainPageSlice } from './../pages/Main/Main';

const { Step } = Steps;

// TODO: Update the user profile and allow balance re-fetch without changing the connection
export const updateData= async (dispatch:Dispatch<AnyAction>) => {
  try {
      const client = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionWeb3Client);
      const userProfile = await client.getUserProfile();
      const Actions = connectSlice.actions;
      dispatch(Actions.userProfileUpdated({userProfile}))
      console.log(userProfile,'updated userProfile on swapModal')
  } catch (e) {
      if(!!(e as any).message){
          dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as any).message }));
      }
  }finally {
      dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
  }
}

async function updateFirstStage(item: ChainEventBase, dispatch: Dispatch<AnyAction>): Promise<ChainEventBase> {
  try {
    const sc = inject<BridgeClient>(BridgeClient);
    const res = await sc.checkTxStatus(dispatch,item.id,item.network,Date.now());
    if(res) {
      if(res && res === 'successful') {
		    dispatch(SidePanelSlice.actions.moveToNext({step: 2}));
        await updateData(dispatch)
        return { ...item, status: 'completed' };
      }
      if(res && res === 'failed'){
		dispatch(SidePanelSlice.actions.moveToNext({step: -1}));
        return { ...item, status: 'failed' };
      }
    }
    return { ...item, status: res || 'pending'};
  } catch (e) {
    console.error('error updating', e);
    return item;

  }
}

async function updateWithdrawStatus(id: string, dispatch: Dispatch<AnyAction>): Promise<ChainEventStatus> {
  try {
    const sc = inject<BridgeClient>(BridgeClient);
    const connect = inject<Connect>(Connect);
    const network = connect.network() as any;
    await updateData(dispatch)
    const items = await sc.getUserWithdrawItems(dispatch, network);
    if(items && items.withdrawableBalanceItems.length > 0) {
        const findMatch = items.withdrawableBalanceItems.find((e:any)=>e.receiveTransactionId === id.replace('_STEP2', '')); // TODO: Hack! find a better way
        if(!!findMatch){
		      dispatch(SidePanelSlice.actions.moveToNext({step: 3}));
          dispatch(MainPageSlice.actions.setProgressStatus({status:3}));
          return 'completed';
        }
    }
    return 'pending';
  } catch (e) {
    console.error('error updating', e);
    return 'failed';
  }
}

async function updateSecondStage(item: ChainEventBase, dispatch: Dispatch<AnyAction>): Promise<ChainEventBase> {
  const newStatus = await updateWithdrawStatus(item.id, dispatch);
  if(newStatus === 'completed'){
	  return { ...item, status: 'completed' };
  }
  return { ...item, status: 'pending' };
}

export function SwapModal (props: {
  status: number,
  setStatus: (v:number)=>void,
  txId: string,
  sendNetwork: string,
  timestamp: number,
  swapping: boolean,
  itemId: string
  claim: (dispatch:Dispatch<AnyAction>) =>  void
}) {
  const theme = useContext(ThemeContext);
  const styles = themedStyles(theme);    
  const [refreshing,setRefreshing] = useState(false)
  const dispatch = useDispatch()
  const pageProps =  useSelector<BridgeAppState, SidePanelProps>(state => state.ui.sidePanel);
  const handleCheckItem = async () => {
    setRefreshing(true)
    await updateWithdrawStatus(props.itemId + '_STEP2', dispatch)    
    setRefreshing(false)
  }

  return (
    <div>    
        <div className={styles.body}>
          <Steps
            className={styles.textStyles}
            direction="vertical" 
          >

              <Step 
                className={styles.textStyles}
                status={pageProps.step > 1 ? "finish" : "wait"} 
                title={pageProps.step === 1 ? 'Swapping token' : 'Swap Success'}
                description={
                  <ChainEventItem
                      id={props.txId}
                      network={props.sendNetwork as any}
                      initialStatus={props.swapping && pageProps.step === 1 ? 'pending' : 'completed'}
                      eventType={'SWAP_STAGE_1'}
                      updater={updateFirstStage}
                  >
                  <div className={styles.textStyles}>
                    {pageProps.step > 1 ? `Your Swap transaction was successfully processed` :
                      pageProps.step < 0 ? 'Swap transaction failed' 
                    : `Your Swap is processing in ${props.sendNetwork}`}  <span><a onClick={() => window.open(Utils.linkForTransaction(props.sendNetwork,props.txId), '_blank')}>{props.txId}</a></span>
                  </div>
                  </ChainEventItem>
                }
                style={{"color": `${theme.get(Theme.Colors.textColor)}`}}
                icon={
                  pageProps.step === 1 ? <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/> : 
                  pageProps.step === -1  ? <CloseCircleOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/> 
                  : undefined
                }  
              />
              <Step 
                status={pageProps.step> 2 ? "finish" : pageProps.step > 1 ? "wait" : "process"} 
                title= {pageProps.step === 2 ? <div style={{"fontSize": "11.5px"}}>Withdrawal Processing</div> : 'Process Claim'}
                description={
                  <ChainEventItem
                      id={props.itemId + '_STEP2'}
                      network={props.sendNetwork as any}
                      initialStatus={pageProps.step === 2 ? 'pending' : 'completed'}
                      eventType={'SWAP_STAGE_2'}
                      updater={updateSecondStage}
                  >
                    <div className={styles.textStyles}>
                      {pageProps.step === 2 ? 'Your Claim item is being processed' : pageProps.step > 2 ? 'Claim Item Processed' : 'Awating Network Transaction'}
                      {pageProps.step === 2 && <p onClick={()=>handleCheckItem()}
                        className={styles.cursorStyles}
                      > Refresh Status < ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}} spin={refreshing}/></p> }
                    </div>
                  </ChainEventItem>
                }
                style={{"color": `${theme.get(Theme.Colors.textColor)}`}}
                icon={pageProps.step === 2 && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
              />
            <Step 
              status={pageProps.step > 2 ? "finish" : "wait"} 
              title="Claim Withdrawal" 
              description={<></>}
              style={{"color": `${theme.get(Theme.Colors.textColor)}`}}
            />
          </Steps>
        </div>
    </div>
  );
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

//@ts-ignore
const themedStyles = (theme) => mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    width: '50%',
    padding: '1rem',
    backgroundColor: `grey`
  },
  header: [
    // eslint-disable-next-line
    {
      flex: '1 1 auto',
      borderTop: `2px solid ${Theme.Colors.bkgShade0}`,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
      fontSize: '18px',
      justifyContent: "space-between"
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 10px 0px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
      color: theme.get(Theme.Colors.textColor),

    },
    color: theme.get(Theme.Colors.textColor),
    marginTop: '0.5rem',
    marginBottom: '0rem'
  },
  textStyles: {
    color: theme.get(Theme.Colors.textColor),
    fontSize: '12px'
  },
  center: {
    color: theme.get(Theme.Colors.textColor),
    fontSize: '12px',
    textAlign: "center"
  },
  cursorStyles: {
    color: theme.get(Theme.Colors.textColor),
    cursor: "pointer",
    marginTop: '0.2rem'
  }
});
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    marginLeft: 'auto',
    marginTop: '2px',
    marginRight: '2px',
    color: 'white'
  },
  rootHovered: {
    color:  'white'
  },
};
