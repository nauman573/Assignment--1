const express = require('express');
const connection = require('../db/connection');

const router = express.Router();


//1. Get all cash receipts entries between a specified transaction date range with category names.

router.get('/transaction/:start_date/:end_date',(req, res) => {
    let sql = `select cash_categories.id, cash_categories.category_name, cash_categories.created_at, cash_categories.image, cash_categories.is_active, cash_categories.organization_id, cash_categories.updated_at, cash_receipts.amount, cash_receipts.category_id, cash_receipts.created_at, cash_receipts.edited_by, cash_receipts.id from cash_categories join cash_receipts on cash_categories.id = cash_receipts.id where cash_receipts.transaction_date between '${req.params.start_date}' and '${req.params.end_date}'`;
        connection.query(sql, (err, cash_receipts) => {
            if(err) {
                res.status(404).send(err.message);
            }
            else {
                res.status(200).send(cash_receipts);
            }
        });
    });
    
    //#2. Get user wise all daily expenditure lists along with category name.
    
    
    router.get('/expenditure/:user_id',(req, res)=>{
        let sql = `select daily_expenditures.amount, daily_expenditures.id, daily_expenditures.user_id,daily_expenditures.created_at, daily_expenditures.edited_by,daily_expenditures.image,daily_expenditures.notes, daily_expenditures.organization_id, daily_expenditures.parent_id,daily_expenditures.reference_no,daily_expenditures.transaction_date 
        ,expenditure_categories.category_name, expenditure_categories.created_at, 
        expenditure_categories.image, expenditure_categories.updated_at,
        expenditure_categories.id from  daily_expenditures join expenditure_categories 
        on daily_expenditures.id = expenditure_categories.id where daily_expenditures.user_id='${req.params.user_id}'`;
            connection.query(sql, (err, expenditure)=>{
                if(err){
                   res.status(404).send(err.message);
                }
                else{
                    res.status(200).send(expenditure);
                }
            });
        });
    
        //#3. Get  the remaining cash for a particular user till date
    
    
        router.get('/remaining/:id',(req, res)=>{
            let sql = `select user.id, sum(cash1.amount) as cash, sum(revenues.amount) as revenue, sum(expenditures.amount) as expenditure from users user, cash_receipts cash1, daily_expenditures expenditures,  daily_revenues revenues where user.id = cash1.user_id and user.id = revenues.user_id and user.id = expenditures.user_id and user.id = '${req.params.id}' group by user.id`;
            connection.query(sql, (err, cash_details)=>{
            if(err){
              console.log(err.message);
                }
    
              else {
                const updated_cash = cash_details.map(r => {
                    let remaining_cash = (r.cash + r.revenue) - r.expenditure;
                    console.log(remaining_cash)
        
                    return { ...r, remaining_cash}
                });
                 res.status(200).send(updated_cash);
              }  
             });
        });
    
    
        //#4. Update Customer name          
    
        router.get('/customer/:name/:id',(req, res)=>{
             let sql = `update users set name = '${req.params.name}' where users.id='${req.params.id}'`;
                connection.query(sql, (err, result)=>{
                     if(err){
                         console.log(err.message);
                    }
                    else{
                        console.log(result);
                        res.status(200).send("Customer name has been updated successfully");
                        }
                       });
                    });
    
    
    
        //#5. Update amount 
        
          router.get('/revenues/:reference_no/:amount',(req, res)=>{
            `SET SQL_SAFE_UPDATES = 0`; 
            let sql = `update daily_revenues set amount = '${req.params.amount}' 
            where daily_revenues.reference_no = '${req.params.reference_no}'`;
            connection.query(sql, (err, result)=>{
            if(err){
              console.log(err.message);}
    
             else{
                console.log(result);
                res.status(200).send(`Amount has been updated successfully for the reference no" ${req.params.reference_no}`);
                `SET SQL_SAFE_UPDATES = 1`;
             } 
             });
        });
             
        
module.exports = router;    