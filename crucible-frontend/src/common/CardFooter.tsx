import React from 'react'
import { BigUtils, CrucibleInfo } from 'types'

export const CardFooter = (props:{crucible?:CrucibleInfo}) => {
    return (
        <div className='cr-footer'>
            <div className='heading'>
                Crucible Token Info
            </div>
            <div className='content'>
                <span>
                <span>{`${BigUtils.safeParse(props.crucible?.feeOnWithdrawRate|| '0').times(100).toString()}%`}</span>
                <span className='label'> Withdraw Fee</span>
                </span>
                <span>
                    <span>{`${BigUtils.safeParse(props.crucible?.feeOnTransferRate  || '0').times(100).toString()}%`}</span>
                <span className='label'> Transfer Fee</span>
                </span>
                <span>
                    <span>{props.crucible?.symbol}</span>
                <span className='label'>Crucible Token</span>
                </span>
            </div>
        </div>
    )
}