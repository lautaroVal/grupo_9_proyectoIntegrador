const { loadProducts, storeProducts } = require('../data/productsModule');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {

	productsList: (req, res) => {
		const products = loadProducts();
		return res.render('products/products', {
			products,
			/* toThousand */
		})
	},

	/* DETAIL */
	productDetail: (req, res) => {

		const products = loadProducts();

		const productId = products.find(product => product.id === +req.params.id);
		return res.render('products/productDetail', {
			productId,
			toThousand
		})
	},
	/* CART */
	productCart: (req, res) => res.render('products/productCart'),

	/* CREATE */
	productAdd: (req, res) => {
		return res.render('products/productAdd')
	},

	productAddStore: (req, res) => {
		const { name, price, discount, description, category,imageText, color,status} = req.body

		const products = loadProducts();

		const newProduct = {
			id: (products[products.length - 1].id + 1),

			name: name.trim(),
			description: description.trim(),
			price: +price,
			discount: +discount,
			image: imageText || 'guitarra_electrica_yamaha_pacifica_012_dark.jpg',
			color,
			category,
			status
		}

		const productsModify = [...products, newProduct];
		storeProducts(productsModify)
		return res.redirect('/products')
	},

	/* EDIT */
	productEdit: (req, res) => {
		const products = loadProducts();
		const product = products.find(product => product.id === +req.params.id);

		res.render('products/productEdit', {
			product
		})
	},

	update: (req, res) => {
		const products = loadProducts();
		const { name, price, category, description, status, color, discount,imageText} = req.body;


		const producstModify = products.map(product => {
			if (product.id === +req.params.id) {
				return {
					...product,
					name: name.trim(),
					description: description.trim(),
					price: +price,
					category,
					discount: +discount,
					image: imageText || product.image ||'guitarra_electrica_yamaha_pacifica_012_dark.jpg',
					color,
					status
				}
			}
			return product
		})
		storeProducts(producstModify);
		return res.redirect('/products/productDetail/' + req.params.id);
	},

	destroy : (req, res) => {
		const products = loadProducts();

		const {id} = req.params;
		const productDelete = products.filter(products => products.id !== +id);
		storeProducts(productDelete);
		return res.redirect('/products');
	}
}


/* (req,res) => res.sendFile(path.resolve(__dirname, 'views', 'productDetail.html')), */
/* (req,res) => res.sendFile(path.resolve(__dirname, 'views', 'productCart.html')) */