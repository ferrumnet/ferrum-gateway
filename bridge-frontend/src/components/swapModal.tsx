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
import { Utils } from '../common/Utils';
import { AnyAction, Dispatch } from "redux";
import { useDispatch } from 'react-redux';

const { Step } = Steps;

export function SwapModal (props: {
  isModalOpen: boolean,
  showModal:()=>void,
  hideModal:()=>void,
  status: number,
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
  const [modalStatus,setModalStatus] = useState(1)
  const [refreshing,setRefreshing] = useState(false)
  const dispatch = useDispatch()
  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title');

  useEffect(
    ()=>{
      if(props.isModalOpen){
        let tx =props.txId;        
        if(modalStatus === 1){
          setTimeout(
            async ()=>{
            const status = await props.callback(dispatch,tx,props.sendNetwork,props.timestamp)
            if(status && status === 'successful'){
              setModalStatus(2);
            }
          },6000);
        }

        if(modalStatus === 2){
          setTimeout(
            async ()=>{
              console.log('calling')
              const status = await props.itemCallback(dispatch,props.itemId)
              console.log('called',status)
              if(status && status === 'created'){
                setModalStatus(3);
              }
          },6000);
        }
      }
    }
  )

  const handleCheckItem = async () => {
    setRefreshing(true)
    const status = await props.itemCallback(dispatch,props.itemId)
    if(status && status === 'created'){
      setModalStatus(3);
    }
    setRefreshing(false)
  }

  
  const handleReset = () => {
    setModalStatus(1);
    setTimeout(()=>{
      props.hideModal();
    },100)
  }
  
  return (
    <div>    
      <Modal
        titleAriaId={titleId}
        isOpen={props.isModalOpen}
        onDismiss={handleReset}
        isBlocking={false}
        containerClassName={styles.container}
        isClickableOutsideFocusTrap={false}
        isModeless={true}
      >
        <div className={styles.header}>
          <span id={titleId}>Swap Transaction</span>
          <IconButton
            styles={{icon: {color: 'white'}}}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
          />
          <CloseCircleOutlined
            onClick={handleReset}
          />
        </div>
        <div className={styles.body}>
          <Steps
            className={styles.textStyles}
          >
            <Step 
              className={styles.textStyles}
              status={modalStatus > 1 ? "finish" : "wait"} 
              title={modalStatus === 1 ? 'Swapping token' : 'Swap Success'}
              description={
                <div className={styles.textStyles}>
                  {modalStatus > 1 ? `Your Swap transaction was successfully processed`
                  : `Your Swap is processing in ${props.sendNetwork}`}  <span><a onClick={() => window.open(Utils.linkForTransaction(props.sendNetwork,props.txId), '_blank')}>{props.txId}</a></span>
                </div>
              }
              icon={modalStatus === 1 && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
            />
            <Step 
              status={modalStatus > 2 ? "finish" : modalStatus > 1 ? "wait" : "process"} 
              title= {modalStatus === 2 ? 'Withdrawal Processing' : 'Process Claim'}
              description={
                <div className={styles.textStyles}>
                  {modalStatus === 2 ? 'Your Claim item is being processed' : modalStatus > 2 ? 'Claim Item Processed' : 'Awating Network Transaction'}
                  {modalStatus === 2 && <p onClick={()=>handleCheckItem()} className={styles.cursorStyles}> Refresh Status < ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}} spin={refreshing}/></p> }
                </div>
              }
              icon={modalStatus === 2 && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
            />
            <Step 
              status={modalStatus > 2 ? "finish" : "wait"} 
              title="Claim Widthdrawal" 
              description={
                <div className={styles.center}>
                  {modalStatus === 3 && <a style={{color: `${theme.get(Theme.Colors.textColor)}`,marginTop: '0.2rem'}} onClick={()=>{handleReset(); props.claim(dispatch) }}>Claim</a> }
                </div>
              }
            />
          </Steps>
        </div>
      </Modal>
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
    padding: '1rem'
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
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
      color: theme.get(Theme.Colors.textColor),

    },
    color: theme.get(Theme.Colors.textColor),
    marginTop: '0.5rem',
    marginBottom: '2rem'
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