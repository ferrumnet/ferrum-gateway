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
import { Utils,ChainEventBase } from 'types';
import { AnyAction, Dispatch } from "redux";
import { useDispatch } from 'react-redux';
import { ChainEventItem } from 'common-containers/dist/chain/ChainEventItem';
import { BridgeClient } from "./../clients/BridgeClient";
import { inject} from 'types';
import {SidePanelSlice} from './../components/SidePanel';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { UnifyreExtensionWeb3Client,CurrencyList } from 'unifyre-extension-web3-retrofit';
import {connectSlice} from "common-containers";
import { CommonActions,addAction } from './../common/Actions';

const { Step } = Steps;

const updateData= async (dispatch:Dispatch<AnyAction>) => {
  try {
      const client = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionWeb3Client);
      const userProfile = await client.getUserProfile();
      const Actions = connectSlice.actions;
      dispatch(Actions.connectionSucceeded({userProfile}))
      console.log(userProfile,'userProfile')
  } catch (e) {
      if(!!e.message){
          dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message }));
      }
  }finally {
      dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
  }
}

async function updateFirstStage(item: ChainEventBase, dispatch: Dispatch<AnyAction>): Promise<ChainEventBase> {
  try {
    const sc = inject<BridgeClient>(BridgeClient);
    const res = await sc.checkTxStatus(dispatch,item.id,item.network,Date.now());
    if(res){
      if(res && res === 'successful'){
        if(item.stater) item.stater(2)
        setTimeout(async ()=>{
          await updateData(dispatch)
        },3000)
        return { ...item, status: 'completed' };
      }
      if(res && res === 'failed'){
        if(item.stater) item.stater(-1)
        return { ...item, status: 'failed' };
      }
    }
    return { ...item, status: 'pending' };
  } catch (e) {
    console.error('error updating', e);
    return item;

  }
}

async function updateSecondStage(item: ChainEventBase, dispatch: Dispatch<AnyAction>): Promise<ChainEventBase> {
  try {
    const sc = inject<BridgeClient>(BridgeClient);
    const connect = inject<Connect>(Connect);
    const network = connect.network() as any;
    const items = await sc.getUserWithdrawItems(dispatch,network);
    if(items && items.withdrawableBalanceItems.length > 0){
        dispatch(SidePanelSlice.actions.widthdrawalItemsFetched({items: items.withdrawableBalanceItems}));
        const findMatch = items.withdrawableBalanceItems.filter((e:any)=>e.receiveTransactionId === item.id);
        if(findMatch.length > 0){
          if(item.stater) item.stater(3);
          return { ...item, status: 'completed' };
        }
    }   
    return { ...item, status: 'pending' };
  } catch (e) {
    console.error('error updating', e);
    return item;

  }
}


export function SwapModal (props: {
  isModalOpen: boolean,
  showModal:()=>void,
  hideModal:()=>void,
  showNoti: (v:boolean) => void,
  status: number,
  setStatus: (v:number)=>void,
  txId: string,
  sendNetwork: string,
  timestamp: number,
  callback:(dispatch:Dispatch<AnyAction>,txId:string,sendNetwork:string,timestamp:number)=>Promise<string|undefined>
  itemCallback:(dispatch:Dispatch<AnyAction>,itemId:string)=>Promise<string|undefined>,
  itemId: string
  claim: (dispatch:Dispatch<AnyAction>) =>  void
}) {
  const theme = useContext(ThemeContext);
  const styles = themedStyles(theme);    
  const [refreshing,setRefreshing] = useState(false)
  const dispatch = useDispatch()
    
  const handleCheckItem = async () => {
    setRefreshing(true)
    const status = await props.itemCallback(dispatch,props.itemId)
    if(status && status === 'created'){
      props.setStatus(3);
    }
    setRefreshing(false)
  }


  const handleReset = () => {
    props.setStatus(1);
    setTimeout(()=>{
      props.hideModal();
    },100)
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
                status={props.status > 1 ? "finish" : "wait"} 
                title={props.status === 1 ? 'Swapping token' : 'Swap Success'}
                description={
                  <ChainEventItem
                      id={props.txId}
                      network={props.sendNetwork as any}
                      initialStatus={'pending' /*e.used*/}
                      eventType={'SWAP_STAGE_1'}
                      stater={props.setStatus}
                      callback={props.callback}
                      updater={updateFirstStage}
                  >
                  <div className={styles.textStyles}>
                    {props.status > 1 ? `Your Swap transaction was successfully processed` :
                      props.status < 0 ? 'Swap transaction failed' 
                    : `Your Swap is processing in ${props.sendNetwork}`}  <span><a onClick={() => window.open(Utils.linkForTransaction(props.sendNetwork,props.txId), '_blank')}>{props.txId}</a></span>
                  </div>
                  </ChainEventItem>
                }
                style={{"color": `${theme.get(Theme.Colors.textColor)}`}}
                icon={
                  props.status === 1 ? <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/> : 
                  props.status === -1  ? <CloseCircleOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/> 
                  : undefined
                }  
              />
              <Step 
                status={props.status > 2 ? "finish" : props.status > 1 ? "wait" : "process"} 
                title= {props.status === 2 ? <div style={{"fontSize": "11.5px"}}>Withdrawal Processing</div> : 'Process Claim'}
                description={
                  <ChainEventItem
                      id={props.itemId}
                      network={props.sendNetwork as any}
                      initialStatus={'pending' /*e.used*/}
                      eventType={'SWAP_STAGE_2'}
                      stater={props.setStatus}
                      callback={props.itemCallback}
                      updater={updateSecondStage}
                  >
                    <div className={styles.textStyles}>
                      {props.status === 2 ? 'Your Claim item is being processed' : props.status > 2 ? 'Claim Item Processed' : 'Awating Network Transaction'}
                      {props.status === 2 && <p onClick={()=>handleCheckItem()} className={styles.cursorStyles}> Refresh Status < ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}} spin={refreshing}/></p> }
                    </div>
                  </ChainEventItem>
                }
                style={{"color": `${theme.get(Theme.Colors.textColor)}`}}
                icon={props.status === 2 && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
              />
            <Step 
              status={props.status > 2 ? "finish" : "wait"} 
              title="Claim Withdrawal" 
              description={
                <div className={styles.center}>
                  {props.status === 3 && <a style={{color: `${theme.get(Theme.Colors.textColor)}`,marginTop: '0.2rem'}} onClick={()=>{handleReset(); props.claim(dispatch) }}>Claim</a> }
                </div>
              }
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
