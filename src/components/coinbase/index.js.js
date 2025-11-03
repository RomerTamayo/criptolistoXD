//index.js
// npm i express dtoenv coinbase-commerce-node morgan cors

const express = require("express");
const{
    COINBASE_API_KEY,
    COINBASE_WEBHOOK_SECRET,
    DOMAIN
} = require('./config')


//CHARGES  
const {Client, resources, Webhook} = require('coinbase-commerce-node')
//modulo morgan
const morgan = require('morgan')

Client.init(COINBASE_API_KEY)

const {Charge} = resources

const app = express();

app.use(morgan('dev'))

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
})
);

app.get('/create-charge', async (req, res) => {
    const chargeData = {
        name: 'The Sovereign Individual',
        description: 'Mastering the Transition to the Information Age',
        local_price: {
            amount: '0.02',
            currency: 'USD'
        },
        pricing_type: 'fixed_price',
        metadata: {
            custommer_id: "idssd",
            customer_name: 'Satoshi Nakamoto'
        },
        redirect_url: `${DOMAIN}/success-payment`,
        cancel_url: `${DOMAIN}/cancel-payment`
    }
    const charge = await Charge.create(chargeData)
    res.send(charge)
})


app.get('/payment-handler/', (req, res) => {
    const rawBody = req.rawBody
    const signature = req.headers['x-cc-webhook-signature']
    const webhookSecret = COINBASE_WEBHOOK_SECRET

    let event
    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret)
        if(event.type === 'charge:pending'){
            console.log('cargo pendiente')
        }
        if(event.type === 'charge:confirmed'){
            console.log('cargo confirmado')
        }
        if(event.type === 'charge:failed'){
            console.log('cargo fallido')
        }
    } catch (error) {
        conslole.log(error)
        res.status(400).send('failed')
    }
    return res.status(200).send(event.id)

})
app.get('/success-payment/', (req, res) => {
    res.send('pago exitoso')

})
app.get('/cancel-payment/', (req, res) => {
    res.send('pago cancelado')

})


app.listen(3000);
console.log("port", 3000);
