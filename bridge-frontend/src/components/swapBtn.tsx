import React, { useState } from 'react';
import './swapBtn.scss';

export function AnimatedSwapBtn (props:{setIsNetworkReverse:any,isNetworkReverse:boolean}) {
    const handleSwitch = async () => {
        props.setIsNetworkReverse()
    }
    return (
        <a className={`button switch ${!props.isNetworkReverse && 'right'}`} onClick={() => handleSwitch()}>
            <div className="arrows"></div>
        </a>
    )
}