import { Injectable } from 'ferrum-plumbing';
import sgMail = require('@sendgrid/mail');
import { getEnv } from "./BridgeProcessorTypes";
import fetch from "cross-fetch";

export class BridgeNotificationSvc implements Injectable {

    __name__() { return 'BridgeNotificationSvc'; }

    async sendMail (to, subject, { body, button }) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        let data = {
            from: getEnv("NOTIFICATION_EMAIL_SENDER"),
            to,
            templateId: getEnv("SEND_GRID_TEMPLATE_ID"),
            dynamic_template_data: {
                subject,
                title: subject,
                body,
                button,
            }
        }
        sgMail.send(data).then((body)=>{
            console.log('body==>', 'notification email sent');
        },error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        })
    }

    async fetchUrl(url,payload:string,headers:any) {
        try {
            const res = await fetch(url,{
                method: 'POST',
                headers: headers,
                body: payload
            })
            return res
        } catch (error) {
            console.log(error)
        }
       
    }

    async sendToListener(url:string,liquidity:string,isLow?:boolean) {
        const payload = `{\"availableLiquidity\":\"${liquidity}\",\"message\":\"Your liquidity level is ${isLow ? 'below' : 'above'} the required threshold, kindly ${isLow ? 'add some liquidity' : 'remove some liquidity for safety'}\"}`
        const headers = {
            'content-type': "application/json"
        }
        await this.fetchUrl(url,payload,headers)
    }
    
    async sendLiquidityNotificationMail(destEmail:string,liquidity:string,isLow?:boolean){
        const subject = `Your Liquidity Level is ${isLow ? 'low' : 'high'}`;
        const msgMail = {
            body: `Hello, Your Liquidity level is now ${liquidity} which is ${isLow ? 'lower than your set limit, add liquidity now' : 'higher than your set limit, remove some liquidity now for safety'}`,
            button:{
              text:"Manage Liquidity",
              href:``,
            }
          }
        await this.sendMail(destEmail,subject, msgMail)
    }

}