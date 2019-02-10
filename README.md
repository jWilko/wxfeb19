# wxfeb19

WX Technical Assessment February 2019 

Language: NodeJS v10

## API Routes

        All routes except user require a valid API token

* `GET /user` 
  * returns a json object containing a name and token

* `GET /sort` 
  * returns an ordered list of products 
  * sort order is determined by a `sortOption` query param
  * valid options are : `High`, `Low`, `Ascending`, `Descending` and `Recommended`
   
* `POST /trolleyTotal`
  * returns the lowest price calculated for a given combination of Products, Quantities and Specials
  * Sample request body:
        
        {
          "products": [
            {
              "name": "string",
              "price": 3.05
            }
          ],
          "specials": [
            {
              "quantities": [
                {
                  "name": "string",
                  "quantity": 2
                }
              ],
              "total": 4.50
            }
          ],
          "quantities": [
            {
              "name": "string",
              "quantity": 3
            }
          ]
        }
        
## Running the app

Run with `npm start`

Debug with `npm run debug`        

## Unit testing

Run with : `npm test`
