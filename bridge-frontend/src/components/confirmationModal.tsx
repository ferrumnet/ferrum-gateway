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
import 'antd/dist/antd.css';
//@ts-ignore
import {RegularBtn,Divider} from 'component-library';
import { Alert } from 'antd';

const { Step } = Steps;

export function ConfirmationModal (props: {
    isModalOpen: boolean,
    amount: string,
    sourceNetwork: string,
    destinationNatwork: string,
    token:string,
    destination:string,
    fee: string,
    total: string,
    processSwap: ()=> Promise<void>,
    setIsModalClose: () => void
}) {
  const theme = useContext(ThemeContext);
  const styles = themedStyles(theme);    
  const [refreshing,setRefreshing] = useState(false)
  const titleId = useId('title');

  useEffect(
    ()=>{
      
    }
  ,[])
    
  const handleCheckItem = async () => {
    setRefreshing(true)
    
    setRefreshing(false)
  }

  
  const handleReset = () => {
   
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
          <span id={titleId}>Confirm </span>
        </div>
        <div className={styles.body}>
            <div className={styles.headerAmount}>{props.amount} {props.token}</div>
            <div className={styles.itemList}>{props.sourceNetwork} to {props.destinationNatwork}</div>
            <div className={styles.itemList}>
                <div className={styles.listLabel}>Asset</div>
                <div className={styles.listItem}>{props.token}</div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listLabel}>Destination</div>
                <div className={styles.listItem}>{props.destination}</div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listLabel}>Fee</div>
                <div className={styles.listItem}>{props.fee}</div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listLabel}>You will receive</div>
                <div className={styles.listItem}>{props.total}</div>
            </div>
            <div className={styles.btnList}>
                <Alert
                    message="Additional note about notification and withdrawals. More informational notes before swap." type="info" showIcon
                />
            </div>
            <div className={styles.btnList2}>
                <RegularBtn text={'Confirm Swap'}
                    propStyle={{
                        padding: '25px 10%',
                        borderRadius: '5px'
                    }}
                    onClick={()=>{props.processSwap();props.setIsModalClose()}}
                />
                <RegularBtn text={'Cancel'}
                    propStyle={{
                        padding: '25px 10%',
                        borderRadius: '5px'
                    }}
                    onClick={()=>props.setIsModalClose()}
                />
            </div>
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
    minWidth: '33%',
    padding: '1rem',
    backgroundColor: 'white'
  },
  itemList: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '13px',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1.2px',
    borderBottomColor: '#00000029',
    fontWeight: 600
  },
  btnList: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '13px',
  },
  btnList2: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '13px',
    width: '60%',
    margin: '0px auto'
  },
  listItem: {
    textAlign: 'end' as 'end',
    width: '60%',
    fontWeight: 600
  },
  listLabel: {
    textAlign: "start" as "start",
    width: '40%',
    fontWeight: 600

  },
  header: [
    // eslint-disable-next-line
    {
      flex: '1 1 auto',
      borderTop: `2px solid ${Theme.Colors.bkgShade0}`,
      display: 'flex',
      alignItems: 'center',
      padding: '12px 12px 0px 24px',
      fontSize: '18px',
      justifyContent: "center",
      fontWeight: 600,
      color: theme.get(Theme.Colors.textColor)
    },
  ],
  headerAmount: {
    padding: '0px 12px 0px 24px',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: '22px',
    display: 'flex',
    color: theme.get(Theme.Colors.textColor)
  },
  body: {
    flex: '4 4 auto',
    padding: '0 24px 4px 24px',
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
  },
  dividerStyle: {
        margin: '5px auto',
        width: '10%',
        borderRadius: '20%',
        minWidth: '20%',
        borderTop: '7px solid rgba(0, 0, 0, 0.06)'
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
