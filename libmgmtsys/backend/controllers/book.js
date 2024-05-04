import Prisma from "../prisma/prisma_client.js";

export const createBook = async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.ISBN || !req.body.publisher) {
            return res.json({ error: "Please fill all fields" });
        }
        const book = await Prisma.book.create({
            data: {
                title: req.body.title,
                author: req.body.author,
                ISBN: req.body.ISBN,
                publisher: req.body.publisher
            }
        });
        return res.json({ success: true })
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Please provide an ID.'
            });
        }
        const book = await Prisma.book.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!book) {
            return res.send({
                success: false,
                message: 'Book not found.'
            });
        }
        return res.json(book);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getBookByQuery = async (req, res) => {
    try {
        var size = parseInt(req.params.size) || 25;
        var page = parseInt(req.params.page) || 1;
        var query = req.params.query;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        console.log(query)
        if (query === '') {
            return res.send({
                success: false,
                message: 'Please provide a query.'
            });
        }

        var book = await Prisma.book.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query
                        }
                    },
                    {
                        author: {
                            contains: query
                        }
                    },
                    {
                        ISBN: {
                            contains: query
                        }
                    },
                    {
                        publisher: {
                            contains: query
                        }
                    }
                ]
            },
        });
        book = book.slice((page - 1) * size, page * size);
        return res.json(book);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateBook = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Please provide an ID.'
            });
        }
        const book = await Prisma.book.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!book) {
            return res.send({
                success: false,
                message: 'Book not found.'
            });
        }
        // Update only the fields that are passed in the request body
        const updatedBook = await Prisma.book.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteBook = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Please provide an ID.'
            });
        }
        const book = await Prisma.book.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!book) {
            return res.send({
                success: false,
                message: 'Book not found.'
            });
        }
        await Prisma.book.delete({
            where: {
                id: req.params.id
            }
        });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const changeCopies = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.send({
                success: false,
                message: 'Please provide an ID.'
            });
        }
        const book = await Prisma.book.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!book) {
            return res.send({
                success: false,
                message: 'Book not found.'
            });
        }
        if (req.body.copies < 0) {
            return res.send({
                success: false,
                message: 'Invalid number of copies.'
            });
        }
        const updatedBook = await Prisma.book.update({
            where: {
                id: req.params.id
            },
            data: {
                copies: req.body.copies
            }
        });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ error: error.message });
    }
}