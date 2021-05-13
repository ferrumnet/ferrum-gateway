import React, {useState} from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import './Chain.css';
import { Utils } from 'types';
import { Row } from '../PageLayout';
import {
  Modal,
} from 'office-ui-fabric-react';

function shorten(addr) {
    if (!addr) return '';
    return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4);
}

export function ConnectButton({connected, address, network,
        error,
        frmBalance,
        frmxBalance,
        ethBalance,
        ethSymbol,
        onClick}) {
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <>
        <Modal
            titleAriaId={'titleId'}
            isOpen={isModalOpen}
            onDismiss={() => setModalOpen(false)}
            isModeless={false}
            // containerClassName={contentStyles.container}
            // styles={modalStyle}
        >
            <div>
                <Row>
                    Your address ({network}):
                </Row>
                <Row>
                    <a href={Utils.linkForAddress(network, address)} target="_blank">{address}</a>
                </Row>
                <Row>
                    FRM Balance
                </Row>
                <Row>
                    {frmBalance}
                </Row>
                <Row>
                    FRMX Balance
                </Row>
                <Row>
                    {frmxBalance}
                </Row>
                <Row>
                    {ethSymbol} Balance
                </Row>
                <Row>
                    {ethBalance}
                </Row>
                <PrimaryButton
                    text={'Close'}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Modal>
        <div className="connect-button-container">
            {Utils.ellipsis(frmBalance, 4)} FRM {Utils.ellipsis(frmxBalance)} FRMX {Utils.ellipsis(ethBalance)} {ethSymbol}
            <a onClick={() => setModalOpen(true)}>
                {address && (
                    <span> <small>{network}</small> - {shorten(address)} </span>
                )}
            </a>
            <PrimaryButton
                text={!connected ? 'Connect' : 'Disconnect'}
                onClick={onClick}
            />
        </div>
        </>
    );
}