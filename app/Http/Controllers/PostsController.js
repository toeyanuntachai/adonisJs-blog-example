'use strict'

const Post = use('App/Model/Post') 
const Validator = use('Validator')

class PostsController {
	* index (request, response) { 
		const posts = null
		// const posts = yield Post.all()
		// posts = null
		yield response.sendView('home', { posts: {} }) 
	}

	* create (request, response) {
		yield response.sendView('posts.create') 
	}

	* store (request, response) {
		const postData = request.only('title', 'content')

		const rules = {
			title: 'required',
			content: 'required'
		}

		const validation = yield Validator.validate(postData, rules)

		if (validation.fails()) {
			yield request
			.withOnly('title', 'content')
			.andWith({ errors: validation.messages() })
			.flash()

			response.redirect('back')
			return
		}

		yield Post.create(postData) 
		response.redirect('/')
	}

	* update (request, response) {
		const postData = request.only('id', 'title', 'content')

		const rules = {
			id: 'required',
			title: 'required',
			content: 'required'
		}

		const validation = yield Validator.validate(postData, rules)

		if (validation.fails()) {
			yield request
			.withOnly('title', 'content')
			.andWith({ errors: validation.messages() })
			.flash()

			response.redirect('back')
			return
		}

		const post = yield Post.findBy('id', 1)
		post.fill(postData)

		yield post.save() 
		response.redirect('/posts/edit/' + postData.id)
	}

	* show (request, response) {
		const post = yield Post.find(request.param('id'))
		yield response.sendView('posts.show', { post: post.toJSON() }) 
	}

	* edit (request, response) {
		const post = yield Post.find(request.param('id'))
		yield response.sendView('posts.edit', { post: post.toJSON() }) 
	}

	* delete (request, response) {
		const post = yield Post.find(request.param('id'))
		yield post.delete()
		response.redirect('/')
	}
}

module.exports = PostsController
