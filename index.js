const express = require('express');
const app = express()
const path = require('path')
const bodyParse = require('body-parser')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//config
const docId = '1_VtTcHc8C11Ie84HAq_72v1-5lIUMxtOgPKi2r7SFuc'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views')) 

app.use(bodyParse.urlencoded({ extended: true }))

app.get('/', (req, resp) => {
  resp.render('home')
})
app.post('/', (req, resp) => {  
  const doc = new GoogleSpreadsheet(docId)
doc.useServiceAccountAuth(credentials, (err) => {
  if(err){
    console.log('nao foi possivel abrir a planilha')
  } else {
    console.log('planilha Aberta')
    doc.getInfo((err, info) => {
      const worksheet = info.worksheets[worksheetIndex]
      worksheet.addRow({ name: req.body.name, email: req.body.email, issueType: req.body.issueType,
      howToReproduce: req.body.howToReproduce, expectedOuput: req.body.expectedOuput, 
      receivedOuput: req.body.receivedOuput }, err => {
        resp.send('bug reportado com sucesso')
      })
    })
  }
})
})

app.listen(3000, (err) => {
  if (err) {
    console.log('Aconteceu um erro', err)
  } else {
    console.log('bugtracker rodando na porta http://localhost:3000/')
  }
})