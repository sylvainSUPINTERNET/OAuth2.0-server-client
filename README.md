# OAuth2.0-server-client
Exemple of using OAuth2.0 with Google API (client side) // OAuth 2.0 with Github (server side)


# Starter - server side

**Configure Github API**

Connect on your account and configure Github application

    Generate your OAuth key and secret code

    Root path : http://localhost:4000
    
    callback url : http://localhost:4000/auth/github/callback
    
**Configure app.js**

        clientID: "[YOUR_ID]"
        
        clientSecret: "[YOUR_SECRET]"
        
 **Run server**
 
        nodemon app.js (listening on port ::4000)
        
# Starter - client side
  
  **Configure your account**
      
      Create a google account


  **Run server**
  
      nodemon app.js (listening on port ::4000)
        
