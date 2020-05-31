const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// --> Firebase auth config

var serviceAccount = require('./fir-crud-api-permissions.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://fir-crud-api-8e020.firebaseio.com',
});
const app = express();
app.use(cors({ origin: true }));
const db = admin.firestore();
// --> Routes
app.get('/', (req, res) => {
	return res.status(200).send('Firebase DB for CRUD API');
});

// --> Create === POST
app.post('/api/create', (req, res) => {
	(async () => {
		try {
			await db
				.collection('products')
				.doc('/' + req.body.id + '/')
				.create({
					name: req.body.name,
					description: req.body.desc,
					price: req.body.price,
				});

			return res.status(200).send({ result: 'Product added successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});
// --> Read === GET
app.get('/api/read/:id', (req, res) => {
	(async () => {
		try {
			const document = db.collection('products').doc(req.params.id);
			let products = await document.get();
			let response = products.data();
			return res.status(200).send(response);
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// --> Update === PUT

// --> Delete === DELETE

// --> Export the API to the firebase cloud functions
exports.app = functions.https.onRequest(app);
