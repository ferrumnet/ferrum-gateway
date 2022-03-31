import {useContext, useEffect, useState} from 'react';
import { useId } from '@fluentui/react-hooks';
import {
  mergeStyleSets,
  ResponsiveMode,
  Modal,
  IIconProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { Steps } from 'antd';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import 'antd/dist/antd.css';
//@ts-ignore
import {RegularBtn} from 'component-library';
import { Alert,Divider } from 'antd';
import IconCryptoEth from "cryptocurrency-icons/svg/color/eth.svg";
import IconCryptoBNB from "cryptocurrency-icons/svg/color/bnb.svg";
import IconCryptoMAT from "cryptocurrency-icons/svg/color/matic.svg";
import IconCryptoSOL from "cryptocurrency-icons/svg/color/sol.svg";
import IconCryptoAvax from '../assets/img/avax.png'
import IconCryptoMoonbase from '../assets/img/moonbase.png'
import IconCryptoFantom from '../assets/img/fantom.svg'
import IconCryptoHarmony from '../assets/img/harmony.png'
import IconCryptoShibuya from '../assets/img/shibuya.png'

import { formatter } from './../common/Utils';

const images = {
  "BSC":IconCryptoBNB,
  "BSC_TESTNET":IconCryptoBNB,
  "ETHEREUM":IconCryptoEth,
  "RINKEBY":IconCryptoEth,
  "POLYGON":IconCryptoMAT,
  "MUMBAI_TESTNET":IconCryptoMAT,
  "SOLANA":IconCryptoSOL,
  'AVAX_TESTNET':IconCryptoAvax,
  'MOON_MOONBASE':IconCryptoMoonbase,
  'AVAX_MAINNET':IconCryptoAvax,
  'MOON_MOONRIVER':IconCryptoMoonbase,
  'FTM_TESTNET':IconCryptoAvax,
  'HARMONY_TESTNET_0':IconCryptoHarmony,
  'FTM_MAINNET':IconCryptoFantom,
  'SHIDEN_TESTNET':IconCryptoShibuya


}

const { Step } = Steps;

function shorten(addr:string) {
  if (!addr) return '';
  return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4);
}

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
  
  return (
    <div>    
      <Modal
        titleAriaId={titleId}
        isOpen={props.isModalOpen}
        onDismiss={()=>{}}
        isBlocking={false}
        containerClassName={`${styles.container} cardTheme`}
        isClickableOutsideFocusTrap={false}
        responsiveMode={ResponsiveMode.small}
      >
        <div className={`${styles.header}`}>
            <h5 className="text-vary-color text-center">
              Confirm
              <Divider
                style={{"margin":"12px 0px"}}
              />
            </h5>

        </div>
        <div className={styles.body}>
            <div className={`${styles.headerAmount} text-vary-color`}>{props.amount} {props.token}</div>
            <div className={styles.itemList}>
              <div className={`${styles.tabbedBtn} cardSecTheme`}>
                <div className={styles.centered}>
                  <img 
                    style={{"maxWidth":"32px"}}
                    src={
                    //@ts-ignore
                    images[props.sourceNetwork]} alt="loading"></img>
                  <p>{props.sourceNetwork}</p>
                </div>
                <span>
                  <i style={{"fontSize":"24px"}} className="mdi mdi-arrow-right-bold text-vary-color"></i>
                </span>
                <div className={styles.centered}>
                  <img 
                    style={{"maxWidth":"32px"}}
                    src={
                    //@ts-ignore
                    images[props.destinationNatwork]} alt="loading"></img>
                  <p>{props.destinationNatwork}</p>
                </div>
              </div>
            </div>
            <div className={`${styles.itemList} listTheme`}>
                <div className={styles.listLabel}>Asset</div>
                <div className={styles.listItem}>{props.token}</div>
            </div>
            <div className={`${styles.itemList} listTheme`}>
                <div className={styles.listLabel}>Destination</div>
                <div className={styles.listItem}>{shorten(props.destination)}</div>
            </div>
            <div className={`${styles.itemList} listTheme`}>
                <div className={styles.listLabel}>Fee ({props.fee}%)</div>
                <div className={styles.listItem}>{((Number(props.fee)/100)*Number(props.total))} {props.token}</div>
            </div>
            <div className={`${styles.itemList} listTheme`}>
                <div className={styles.listLabel}>You will receive</div>
                <div className={styles.listItem}>{(Number(props.total) - ((Number(props.fee)/100)*Number(props.total)))} {props.token}</div>
            </div>
            {/* <div className={styles.btnList}>
                <Alert
                    message="Additional note about notification and withdrawals. More informational notes before swap." type="info" showIcon
                />
            </div> */}
            <div className={styles.btnList2}>
                <RegularBtn text={'Confirm Swap'}
                    propStyle={{
                        padding: '25px 10%',
                        borderRadius: '5px',
                        marginBottom: '5px',
                        minWidth: '45%'
                    }}
                    onClick={()=>{props.processSwap();props.setIsModalClose()}}
                />
                <RegularBtn text={'Cancel'}
                    propStyle={{
                        padding: '25px 10%',
                        borderRadius: '5px',
                        marginBottom: '5px',
                        minWidth: '45%'
                    }}
                    onClick={()=>props.setIsModalClose()}
                />
            </div>
        </div>
      </Modal>
    </div>
  );
};

export function LiquidityConfirmationModal (props: {
  isModalOpen: boolean,
  amount: string,
  sourceNetwork: string,
  token:string,
  total: string,
  action:string,
  liquidity:string,
  availableLiquidity:string,
  processLiqAction: ()=> void,
  setIsModalClose: () => void
}) {
const theme = useContext(ThemeContext);
const styles = themedStyles(theme);    
const [refreshing,setRefreshing] = useState(false)
const titleId = useId('title');
const liquidityToBeRemoved = ((Number(props.total)) > (Number(props.availableLiquidity))) ? (Number(props.availableLiquidity)) : (Number(props.total));
const liquidityValue = props.action === 'Added' ? (Number(props.total)) : liquidityToBeRemoved;
return (
  <div>    
    <Modal
      titleAriaId={titleId}
      isOpen={props.isModalOpen}
      onDismiss={()=>{}}
      isBlocking={false}
      containerClassName={`${styles.container} cardTheme`}
      isClickableOutsideFocusTrap={false}
      responsiveMode={ResponsiveMode.medium}
    >
      <div className={styles.header}>
          <h5 className="text-vary-color text-center">
            Confirm
            <Divider
              style={{"margin":"12px 0px"}}
            />
          </h5>
      </div>
      <div className={styles.body}>
          <div className={`${styles.itemList} listTheme`}>
            <div className={`${styles.tabbedBtn} cardSecTheme`}>
              <div className={styles.centered}>
                <div className={`${styles.headerAmount} text-vary-color`}>{props.amount} {props.token}</div>
              </div>
              <span>
                <i style={{"fontSize":"24px"}} className="mdi mdi-arrow-right-bold text-vary-color"></i>
              </span>
              <div className={styles.centered}>
                <img 
                  style={{"maxWidth":"32px"}}
                  src={
                  //@ts-ignore
                  images[props.sourceNetwork]} alt="loading"></img>
                <p>{props.sourceNetwork}</p>
              </div>
            </div>
          </div>
          <div className={`${styles.itemList} listTheme`}>
              <div className={styles.listLabel2}>Asset</div>
              <div className={styles.listItem2}>{props.token}</div>
          </div>
          <div className={`${styles.itemList} listTheme`}>
              <div className={styles.listLabel2}>Your deposited liquidity</div>
              <div className={styles.listItem2}>{formatter.format(props.liquidity,false)}</div>
          </div>
          <div className={`${styles.itemList} listTheme`}>
              <div className={styles.listLabel2}>Liquidity Requested to be {props.action}</div>
              <div className={styles.listItem2}>{(Number(props.total))} {props.token}</div>
          </div>
          <div className={`${styles.itemList} listTheme`}>
              <div className={styles.listLabel2}>Liquidity to be {props.action}</div>
              <div className={styles.listItem2}>{(liquidityValue)} {props.token}</div>
          </div>
          {/* <div className={styles.btnList}>
              <Alert
                  message="Additional note about notification and withdrawals. More informational notes before swap." type="info" showIcon
              />
          </div> */}
          <div className={styles.btnList2}>
              <RegularBtn text={'Confirm'}
                  propStyle={{
                      padding: '25px 10%',
                      borderRadius: '5px',
                      marginBottom: '5px',
                      minWidth: '45%'
                  }}
                  disabled={(Number(liquidityValue) <= 0)}
                  onClick={()=>{props.processLiqAction();props.setIsModalClose()}}
              />
              <RegularBtn text={'Cancel'}
                  propStyle={{
                      padding: '25px 10%',
                      borderRadius: '5px',
                      marginBottom: '5px',
                      minWidth: '45%'
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
    minWidth: '450px',
    width: '30%',
    padding: '0rem 1rem',
    backgroundColor: 'white'
  },
  tabbedBtn: {
    minHeight: '100px',
    boxShadow: 'black -1px 3px 11px -6px',
    padding: '10px',
    borderRadius: '6px',
    alignItems: 'center',
    aligncontent: 'center',
    display: 'flex',
    width: '90%',
    justifyContent: "space-around"
  },
  itemList: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '13px 2px',
    borderBottomStyle: 'solid',
    borderBottomWidth: '0.5px',
    borderBottomColor: '#00000012',
    fontWeight: 600
  },
  btnList: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '13px',
  },
  btnList2: {
    padding: '13px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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
  listItem2: {
    textAlign: 'end' as 'end',
    width: '40%',
    fontWeight: 600
  },
  listLabel2: {
    textAlign: "start" as "start",
    width: '60%',
    fontWeight: 600

  },
  header: [
    // eslint-disable-next-line
    {
      flex: '1 1 auto',
      borderTop: `2px solid ${Theme.Colors.bkgShade0}`,
      alignItems: 'center',
      padding: '12px 12px 0px 24px',
      fontSize: '18px',
      justifyContent: "center",
      fontWeight: 600,
      color: theme.get(Theme.Colors.textColor)
    },
  ],
  headerAmount: {
    padding: '0px 12px 10px 24px',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: '35px',
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
    },
    centered: {
      "textAlign":"center" as "center"
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
