
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'tdrive25';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function main() {
	try {
		const ccp = buildCCPOrg1();

		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		const wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			// await contract.submitTransaction('InitLedger');

			// let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			
			try {
				let result= await contract.evaluateTransaction('CreateUser', 'user_ananyamahato03@gmail.com', 'ananyamahato03@gmail.com', 'ananya123', 'Ananya');
				await contract.submitTransaction('CreateUser', 'user_ananyamahato03@gmail.com', 'ananyamahato03@gmail.com', 'ananya123', 'Ananya');
				console.log(`Create User successful \n Result: ${result}`)
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			try {
				let result= await contract.evaluateTransaction('CreateUser', 'user_abc@gmail.com', 'abc@gmail.com', 'abc123', 'Abhishek');
				await contract.submitTransaction('CreateUser', 'user_abc@gmail.com', 'abc@gmail.com', 'abc123', 'Abhishek');
				console.log(`Create User successful \n Result: ${result}`)
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}


			try {
				let result= await contract.evaluateTransaction('FindUser',  'ananyamahato03@gmail.com', 'ananya123');
				console.log(`User Found\n Result: ${result}\n`)
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			// try {
			// 	let result= await contract.evaluateTransaction('FindUser',  'ananyamahato03@gmail.com', 'ananya1234');
			// 	console.log(`User Found\n Result: ${result}`)
			// } catch (error) {
			// 	console.log(`*** Error: \n    ${error}`);
			// }

			try {
				let result= await contract.evaluateTransaction('CreateFile',
				'file_cert.txt_hash123',
				'cert.txt',
				'/files/cert.txt',
				'hash123',
				'ananyamahato03@gmail.com');
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('CreateFile',
				'file_cert.txt_hash123',
				'cert.txt',
				'/files/cert.txt',
				'hash123',
				'ananyamahato03@gmail.com');
				console.log(`File Created\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			try {
				let result= await contract.evaluateTransaction('CreateFile',
				'file_letter.txt_hash567',
				'letter.txt',
				'/files/letter.txt',
				'hash567',
				'ananyamahato03@gmail.com');
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('CreateFile',
				'file_letter.txt_hash567',
				'letter.txt',
				'/files/letter.txt',
				'hash567',
				'ananyamahato03@gmail.com');
				console.log(`File Created\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}


			try {
				let result= await contract.evaluateTransaction('FindFile',
				'file_cert.txt_hash123');
				
				
				console.log(`File Found\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			} 


			try {
				let result= await contract.evaluateTransaction('ChangeFileName',
				'file_cert.txt_hash123',
				'cert_new.txt',
				'uploads/cert_new.txt');
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('ChangeFileName',
				'file_cert.txt_hash123',
				'cert_new.txt',
				'uploads/cert_new.txt');
				console.log(`File name changed successfully\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}


			// try {
			// 	let result= await contract.evaluateTransaction('DeleteFile',
			// 	'file_letter.txt_hash567');
				

			// 	await contract.submitTransaction('DeleteFile',
			// 	'file_letter.txt_hash567');
			// 	console.log(`File Deleted\n Result: ${result}\n`);
			// } catch (error) {
			// 	console.log(`*** Error: \n    ${error}`);
			// }

			// {
			// 	"selector": {
			// 	   "UploaderEmail": "ananyamahato03@gmail.com",
			// 	   "DocType": "file"
			// 	}
			//  }


			try {
				const email='ananyamahato03@gmail.com'
				let result= await contract.evaluateTransaction('FindFileByUser',email);
				
				
				console.log(`Files found with ${email}:\n ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}


			try {
				let result= await contract.evaluateTransaction('SharedFile',
				'fileShare_cert.txt_hash123',
				'file_cert.txt_hash123',
				'abc@gmail.com');
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('SharedFile',
				'fileShare_cert.txt_hash123',

				'file_cert.txt_hash123',
				'abc@gmail.com');
				console.log(`File Shared successfully\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			try {
				let result= await contract.evaluateTransaction('SharedFile',
				'fileShare_letter.txt_hash567',

				'file_letter.txt_hash567',
				'abc@gmail.com');
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('SharedFile',
				'fileShare_letter.txt_hash567',

				'file_letter.txt_hash567',
				'abc@gmail.com');
				console.log(`File Shared successfully\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}


			try {
				let result= await contract.evaluateTransaction('FindFileShareByFile',
				'file_letter.txt_hash567');
				// console.log(`File Created\n Result: ${result}\n`);

				
				console.log(`File Share list for a particular file:\n ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			try {
				let result= await contract.evaluateTransaction('FindFileShareByUser',
				'abc@gmail.com');
				// console.log(`File Created\n Result: ${result}\n`);

				
				console.log(`File share list for a particular User: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			try {
				let result= await contract.evaluateTransaction('DeleteFileShare',
				'fileShare_cert.txt_hash123');
				
				// console.log(`File Created\n Result: ${result}\n`);

				await contract.submitTransaction('DeleteFileShare',
				'fileShare_cert.txt_hash123');

				console.log(`File Shared deleted\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}`);
			}

			  
		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}


main();
