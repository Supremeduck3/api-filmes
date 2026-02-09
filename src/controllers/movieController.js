import * as model from '../models/movieModel.js';
import prisma from '../utils/prismaClient.js';

export const getAll = async (req, res) => {
    try {
        const movies = await model.findAll(req.query);

        if (!movies || movies.length === 0) {
            return res.status(200).json({
                message: 'Nenhum registro encontrado.',
            });
        }
        res.json(movies);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const titulo = req.body
        const values = Object.values(titulo);
        const { title, description, duration, genre, rating, avalible } = req.body;
        const genero = [
            'Ação',
            'Drama',
            'Comédia',
            'Terror',
            'Romance',
            'Animação',
            'Ficção Científica',
            'Suspense',
        ];

        if (!title) return res.status(400).json({ error: 'O titulo (title) é obrigatório!' });
        if (!duration)
            return res.status(400).json({ error: 'A duração (duration) é obrigatória!' });
        if (!genre) return res.status(400).json({ error: 'O genero (genre) é obrigatório!' });
        if (!description)
            return res.status(400).json({ error: 'A descrição (description) é obrigatório!' });
        if (!rating) return res.status(400).json({ error: 'A avaliação (rating) é obrigatória!' });
        if (!avalible)
            return res.status(400).json({ error: 'A disponiblidade (avalible) é obrigatória!' });
        if (title.length <= 3)
            return res.status(400).json({ error: 'o titulo deve conter mais de 3 caracteres' });
        if (description.length <= 10)
            return res.status(400).json({ error: 'A descrição deve conter mais de 10 caracteres' });
        if (duration.length < 0 || duration.length > 300)
            return res.status(400).json({ error: 'A duração não pode ser negativa' });
        if (!genero.includes(genre))
            return res
                .status(400)
                .json({
                    error: 'Deve ser um genero disponivel Ação, Drama, Comédia, Terror, Romance, Animação, Ficção Científica, Suspense',
                });
        if (rating <= 0 || rating > 10)
            return res.status(400).json({ error: 'Deve estar entre 0 e 10' });
        if (avalible != true) return res.status(400).json({ error: 'Deve estar disponivel' });

        const filmeExistente = await prisma.movie.findFirst({
            where: {
                title: {
                    equals: title,
                    mode: 'insensitive',
                },
            },
        });

        if(filmeExistente)return res.status(400).json({error: 'filme duplicado'})

        const data = await model.create({
            title,
            description,
            duration: parseInt(duration),
            genre,
            rating: parseFloat(rating),
            avalible,
        });

        res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao salvar o registro.' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const update = async (req, res) => {
    try {
        const { id, avalible } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }
        if (avalible == false) {
            return res.status(400).json({
                error: 'O filme tem que estar disponivel!',
            });
        }

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const data = await model.update(id, req.body);
        res.json({
            message: `O registro "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id,rating } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }
        if (rating >= 9) {
            return res.status(400).json({
                error: 'O filme tem que estar disponivel!',
            });
        }

        await model.remove(id);
        res.json({
            message: `O registro "${exists.nome}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};
