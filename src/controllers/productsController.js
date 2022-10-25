const db = require('../database/models');
const { Op } = require('sequelize');
const { loadProducts, storeProducts } = require('../data/productsModule');
const { validationResult } = require('express-validator')
const { OFERTA, SINOFERTA } = require('../constants/products');
/* const { FORCE } = require('sequelize/types/index-hints');
 */
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

module.exports = {

	productsList: async (req, res) => {
		try {
			const products = await db.Product.findAll({
				include: ['images', 'brand', 'category']
			})
			if (products.length) {
				return res.render('products/products', {
					title: "Listado de productos",
					products,
					toThousand
				})
			}
		} catch (error) {
			console.log(error);
		}
	},
	/* DETAIL */
	productDetail: async (req, res) => {
		try {
			const product = await db.Product.findByPk(req.params.id, {
				include: ['images', 'brand', 'category'],
				attributes: {
					exclude: ["created_at", "updated_at"],
				},
			})
			if (product) {
				return res.render('products/productDetail', {
					title: "Detalle de producto",
					product,
					toThousand
				})
			}

		} catch (error) {
			console.log(error);
		}
	},
	/* CART */
	productCart: (req, res) => {
		const products = loadProducts();
		const productId = products.find(product => product.id === +req.params.id);

		res.render('products/productCart', {
			title: "Carrito de compras",
			productId
		})
	},
	/* CREATE */
	productAdd: async (req, res) => {
		try {
			const brands = await db.Brand.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});
			const colors = await db.Color.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});
			const categories = await db.Category.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});
			if (brands && colors && categories) {
				return res.render('products/productAdd', {
					title: "Crear producto",
					brands,
					colors,
					categories
				})
			}

		} catch (error) {
			console.log(error);
		}
	},

	productAddStore: async (req, res) => {
		try {
			let errors = validationResult(req);
			//Si no hay errores crea el producto y redirecciona a products.
			//return res.send(req.files.images)
			if (errors.isEmpty()) {
				const { name, price, status, share, discount, description, brandId, colorId, categoryId } = req.body;
				const product = await db.Product.create({
					...req.body,
					name: name.trim(),
					price: +price,
					status: status ? status : 0,
					share: share ? share : 12,
					discount: +discount,
					image: req.files.image ? req.files.image[0].filename : 'Img-default.jpg',
					description: description.trim(),
					brandId: +brandId,
					colorId: +colorId,
					categoryId: +categoryId
				})
				// Si crea el producto traigo los propiedades name y productId de las imágenes y las creo.
				if (product) {
					let images = req.files.images.map(file => {
						return {
							file: file.filename,
							productId: product.id
						}
					})
					await db.Image.bulkCreate(images)
				}
				//Una vez completa la creación del producto me redirige al listado de productos.
				return res.redirect('/products')

				//Si vienen errores renderizo la vista de creación mostrandolos.
			} else {
				const brands = await db.Brand.findAll({
					attributes: ['id', 'name'],
					order: ['name']
				});
				const colors = await db.Color.findAll({
					attributes: ['id', 'name'],
					order: ['name']
				});
				const categories = await db.Category.findAll({
					attributes: ['id', 'name'],
					order: ['name']
				});

				return res.render('products/productAdd', {
					title: "Crear producto",
					brands,
					colors,
					categories,
					errors: errors.mapped(),
					old: req.body
				})
			}

		} catch (error) {
			console.log(error);
		}
	},

	/* EDIT */
	productEdit: async (req, res) => {
		try {
			const brands = await db.Brand.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});
			const colors = await db.Color.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});
			const categories = await db.Category.findAll({
				attributes: ['id', 'name'],
				order: ['name']
			});

			const product = await db.Product.findByPk(req.params.id, {
				include: [
					{ association: 'brand' },
					{ association: 'colors' },
					{ association: 'images' },
					{
						association: 'category', attributes: {
							exclude: ["created_at", "updated_at"],
						}
					},
				],
			});

			return res.render('products/productEdit', {
				title: "Edicion del Producto",
				product,
				brands,
				colors,
				categories,
				OFERTA,
				SINOFERTA
			})
		} catch (error) {
			console.log(error);
		}
	},

	update: async (req, res) => {
		try {
			const { name, price, share, discount, description, brandId, categoryId, colorId, status } = req.body;
			//return res.send(req.files.image)

			let productModify = await db.Product.update({
				...req.body,
				name: name,
				image: req.files.image?.filename,
				price: +price,
				share: +share,
				discount: +discount,
				description: description,
				brandId,
				categoryId,
				colorId,
				status
			},
				{
					where: {
						id: req.params.id
					}
				}
			)
			if (productModify) {                               //             ¡¡ REVISAR !!
				await db.Image.destroy({
					where: {
						productId: req.params.id,
					},
					force: true
				})
				/* if (imagesDB) {
					let images = req.files.images.map(file => {
						return {
							name: file.filename,
							productId: req.params.id
						}
					})
					await db.Image.bulkCreate(images)
				}	 */

			}
			return res.redirect('/products/productDetail/' + req.params.id);

		} catch (error) {
			console.log(error);
		}

	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const productDelete = await db.Product.destroy({
				where: {
					id: id
				}
			});
			/* 		storeProducts(productDelete);
			 */
			if (productDelete) {
				return res.redirect('/products')
			}
		} catch (error) {
			console.log(error);
		}

		;
	}
}
