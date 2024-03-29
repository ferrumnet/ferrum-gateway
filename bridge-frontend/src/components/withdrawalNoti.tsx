
import React, {useContext, useEffect,  useState } from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
//@ts-ignore
import {WideTextField,RegularBtn} from 'component-library';
import { Modal as ModalPre, ModalProps } from 'antd';

const Modal = ModalPre as any as React.FC<ModalProps & {
children: JSX.Element;
}>;


export const WithdrawNoti = (props:
    {isModalVisible: boolean,setIsModalVisible: (v:boolean)=>void,
        network:string,numberOfWithdrawals:number,sideCtrl: ()=>void,reset: ()=>void
    }
    ) => {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const showModal = () => {
        props.setIsModalVisible(true);
    };

  const handleOk = () => {
    props.sideCtrl();
    props.setIsModalVisible(false);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
    props.reset();
  };

  return (
    <>
      <Modal closeIcon={<></>} className={'cardTheme'} title={<div style={{...styles.centered}}>Congrats You have connected to {props.network}</div>} visible={props.isModalVisible} footer={null}>
        <div>
            <p  style={{...styles.centered}}>It looks like you have {props.numberOfWithdrawals} pending withdrawals on {props.network}.</p>
            <p  style={{...styles.centered}}>Choose the withdrawal network in MetaMask and withdraw your Tokens</p>
            <p  style={{...styles.centered,...styles.spaced}}>
                <RegularBtn
                    text='Retrieve Token Now'
                    propStyle={{...styles.btnStyle}}
                    onClick={()=>handleOk()}

                />
            </p>
            <p></p>
            <p style={{...styles.centered,...styles.underlined}}>
              <a onClick={()=>handleCancel()}>Retrieve Later, Let me Swap.</a>
            </p>
        </div> 
        
      </Modal>
    </>
  );
};

//@ts-ignore
const themedStyles = (theme) => ({
    centered: {
        justifyContent: 'center',
        display: 'flex',
        textAlign: 'center' as "center"
    },
    btnStyle: {
        marginTop: '1rem',
        width: '50%',
        padding: '2rem'
    },
    spaced: {
        justifyContent: 'space-around'
    },
    underlined: {
      textDecoration: 'underline'
    }
})