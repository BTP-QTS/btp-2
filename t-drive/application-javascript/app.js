"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../test-application/javascript/AppUtil.js");
const { json } = require("body-parser");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "tdrive25";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "javascriptAppUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    const ccp = buildCCPOrg1();

    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );

    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);

    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      org1UserId,
      "org1.department1"
    );

    const gateway = new Gateway();

    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      });

      const network = await gateway.getNetwork(channelName);

      const contract = network.getContract(chaincodeName);

      //////////////////////////////////////////////////////////////////

      // server
      const express = require("express");
      const cookieParser = require("cookie-parser");
      const fileUpload = require("express-fileupload");
      const path = require("path");
      const crypto = require("crypto");
      const fs = require("fs");
      const util = require("util");
      var cors= require("cors")

      let app = express();
      const PORT = 3000;

      // parse application/x-www-form-urlencoded
      app.use(cors({
        origin:"http://localhost:3001",
        credentials:true

      }))
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      // parse application/json
      app.use(express.json());
      app.use(express.static("public"));

      app.use(
        fileUpload({
          useTempFiles: true,
          tempFileDir: "tmp/",
          createParentPath: true,
        })
      );

      app.get("/", function (req, res) {
        res.send("Hello World!");
      });

      app.post("/register", async function (req, res) {
        const { email, password, name } = req.body;
        const key = `user_${email}`;

        try {
          let result = await contract.evaluateTransaction(
            "CreateUser",
            key,
            email,
            password,
            name
          );
          await contract.submitTransaction(
            "CreateUser",
            key,
            email,
            password,
            name
          );
          res.send(result.toString());
        } catch (error) {
          console.error(error);
      res.status(400).status(error.toString());
        }

       
      });

      app.post("/login", async function (req, res) {
        const { email, password } = req.body;
        try {
          let result = await contract.evaluateTransaction(
            "FindUser",
            email,
            password
          );
          const user = JSON.parse(result.toString());
          // console.log(user.Email)

         if (user.Email == email && user.Password === password) {
      res.cookie("user", result.toString(), {
        maxAge: 3600_000,
        httpOnly: true,
      });
      res.send(result.toString());
    } else {
      res.status(401).send("Invalid email or password");
    }
        } catch (error) {
          console.error(error);
        }
      });

      app.get("/logout", async function (req, res) {
        const { email, password } = req.body;
        try {
          res.cookie("user", null, { maxAge: 3600_000, httpOnly: true });
          res.send("You have successfully logged out");
        } catch (error) {
          console.error(error);
        }
      });

      async function sha256(filePath) {
        const readFile = util.promisify(fs.readFile);

        const hash = crypto.createHash("sha256");
        const data = await readFile(filePath);
        hash.update(data);
        return `${hash.digest("base64")}`;
      }

      app.post("/file", async function (req, res) {
        // const key = null;
        if (req.cookies.user == null) {
          res.status(400).send("You are not logged in");
          return;
        }
        console.log(req.files?.uploadedFile);

        const uploadedFile = req.files?.uploadedFile;
        if (uploadedFile == undefined) {
          res.status(400).send("You must upload a file");
          return;
        }

        const fileName = uploadedFile.name;
        const fileDest = path.join("public", "uploadedFiles", fileName);
        uploadedFile.mv(fileDest, async (err) => {
          if (err != undefined) {
            res.status(500).send(`Server Error , failed t move file ${err}`);
            return;
          }
          // console.log("appl")
          const user = JSON.parse(req.cookies.user.toString());
          console.log(user);

          const downloadLink = path.join("uploadedFiles", fileName);
          const uploaderEmail = user.Email;
          const key = `file_${uploaderEmail}_${fileName}`;
          const fileHash = await sha256(fileDest);

          // console.log(fileName,fileDest,downloadLink,uploaderEmail,key,fileHash)
          try {
            let result = await contract.evaluateTransaction(
              "CreateFile",
              key,
              fileName,
              downloadLink,
              fileHash,
              uploaderEmail
            );
            // console.log(`File Created\n Result: ${result}\n`);

            await contract.submitTransaction(
              "CreateFile",
              key,
              fileName,
              downloadLink,
              fileHash,
              uploaderEmail
            );
            // console.log(result.toString())
            res.send(result.toString());
          } catch (error) {
            res.status(400).send(error.toString());
          }
        });
      });

	
	  app.get("/file",async function(req,res){
		if (req.cookies.user == null) {
      console.log(req)
			res.status(400).send("You are not logged in");
			return;
		  }
		  try{
			const user = JSON.parse(req.cookies.user.toString());
		let  result= await contract.evaluateTransaction('FindFileByUser',user.Email);
    console.log(result.toString())
			
		res.send(result.toString())
			

		  }
		  catch(err){
        console.log('hello')
      console.log(err.toString())
			res.status(400).send(err.toString())
		  }
		
	  })
    app.get('/profile',async function(req,res){
      if(req.cookies.user==null)
      {
        res.json({
          isLoggedIn:false
        });
        console.log("User not logged in");
        return
      }
      try{
			let user = JSON.parse(req.cookies.user.toString());
      const key=user.key
      let result=await contract.evaluateTransaction("FindUserByKey",key);
      user = JSON.parse(result.toString())
      user.isLoggedIn=true
      res.json(user)
        

      }
      catch(error)
      {
        res.status(500).send(`Error: ${error}`)
      }
    })

	  app.get("/file/:fileKey",async function(req,res){
		if (req.cookies.user == null) {
			res.status(400).send("You are not logged in");
			return;
		  }
		const fileKey=req.params.fileKey;

		  try {
			const user = JSON.parse(req.cookies.user.toString());

			let result= await contract.evaluateTransaction('FindFile',
			fileKey);
			
			const uploadedFile=JSON.parse(result)
			if(uploadedFile.UploaderEmail!=user.Email)
			{
				res.status(400).send("You are not authorized to view this file")
			}
			else{
				res.send(result.toString()) 

			}
			

		  }
		  catch(err){
			res.status(400).send(err.toString())
		  }
		
	  })

	  app.put("/file/:fileKey",async function(req,res){
		if (req.cookies.user == null) {
			res.status(400).send("You are not logged in");
			return;
		  }
		const fileKey=req.params.fileKey;

		  try {
        const user = JSON.parse(req.cookies.user.toString());

			let result= await contract.evaluateTransaction('FindFile',
			fileKey);
			
			const uploadedFile=JSON.parse(result)
			const newFileName=req.body.newFileName
			if(uploadedFile.UploaderEmail!=user.Email)
			{
				res.status(400).send("You are not authorized to update this file")
			}
			else{
        
        const renameFile=util.promisify(fs.rename);
      
        const DestinationPath=path.join('public','uploadedFiles',newFileName)
        const srcPath=path.join('public',uploadedFile.DownloadLink)
        const err=await renameFile(srcPath,DestinationPath)

      
        if (err!=undefined){
          res.status(500).send(`Server Error ${err}`);
          return
        }

        // uploadedFile.Name=newFileName
        // uploadedFile.DownloadLink=DestinationPath
        
				let result= await contract.evaluateTransaction('ChangeFileName',
				fileKey,
				newFileName,
        DestinationPath);
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('ChangeFileName',
				fileKey,
				newFileName,
        DestinationPath);
				res.send(result.toString()) 

			}
			

		  }
		  catch(err){
			res.status(400).send(err.toString())
		  }
		
	  })

    app.post("/fileShare", async function (req, res) {
      const { fileKey, sharedWithEmail } = req.body;
      const key = `fileShare_${fileKey}_${sharedWithEmail}`;
  
      try {
        let result = await contract.evaluateTransaction(
          "SharedFile",
          key,
         fileKey,
         sharedWithEmail
        );
        await contract.submitTransaction(
          "SharedFile",
          key,
         fileKey,
         sharedWithEmail
        );
        res.send(result.toString());
      } catch (error) {
        console.error(error);
      res.status(400).status(error.toString());
  
      }
    })

    app.get("/fileShare/byFile/:fileKey",async function(req,res){
      if (req.cookies.user == null) {
        res.status(400).send("You are not logged in");
        return;
        }
      const fileKey=req.params.fileKey;
  
        try {
        const user = JSON.parse(req.cookies.user.toString());
  
        let result= await contract.evaluateTransaction('FindFile',
        fileKey);
        
        const uploadedFile=JSON.parse(result)
        if(uploadedFile.UploaderEmail!=user.Email)
        {
          res.status(400).send("You are not authorized to view this file")
        }
        else{
          let result= await contract.evaluateTransaction('FindFileShareByFile',
        fileKey);
        res.send(result.toString())
  
        }
        
  
        }
        catch(err){
        res.status(400).send(err.toString())
        }
      
      })

      app.get("/fileShare/withMe",async function(req,res){
        if (req.cookies.user == null) {
          res.status(400).send("You are not logged in");
          return;
          }
        const fileKey=req.params.fileKey;
    
          try {
          const user = JSON.parse(req.cookies.user.toString());
    
          let result= await contract.evaluateTransaction('FindFileShareByUser',
          user.Email);
          
          res.send( result.toString())
          
    
          }
          catch(err){
          res.status(400).send(err.toString())
          }
        
        })


	//   try {
	// 	const email='ananyamahato03@gmail.com'
	// 	let result= await contract.evaluateTransaction('FindFileByUser',email);
		
		
	// 	console.log(`Files found with ${email}:\n ${result}\n`);
	// } catch (error) {
	// 	console.log(`*** Error: \n    ${error}`);
	// }


      var server = app.listen(PORT, function () {});
      console.log(`Server listening on port ${PORT}`);

      /////////////////////////////////////////////////////////////////////
    } finally {
      // gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}

main();
