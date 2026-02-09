import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.movie.createMany({
        data: [
            {
                title: 'Eyes wide shut',
                description:
                    'Em um mundo pós-apocalíptico, Max se une a Furiosa para fugir de um senhor da guerra.',
                duration: 160,
                genre: 'Terror',
                rating: 7.5,
                avalible: true,
            },
            {
                title: 'Um Sonho de Liberdade',
                description:
                    'Dois homens presos criam um laço ao longo de anos, encontrando consolo e eventual redenção.',
                duration: 142,
                genre: 'Drama',
                rating: 9.3,
                avalible: true,
            },
            {
                title: 'Superbad: É Hoje',
                description:
                    'Dois amigos de colégio tentam comprar bebidas para uma festa e acabam em uma confusão insana.',
                duration: 113,
                genre: 'Comédia',
                rating: 7.6,
                avalible: true,
            },
            {
                title: 'Hereditário',
                description:
                    'Após a morte da avó reclusa, a família Graham começa a desvendar segredos terríveis sobre sua ancestralidade.',
                duration: 127,
                genre: 'Terror',
                rating: 7.3,
                avalible: true,
            },
            {
                title: 'Diário de uma Paixão',
                description:
                    'Um homem pobre e uma mulher rica se apaixonam, mas logo são separados por suas diferenças sociais.',
                duration: 123,
                genre: 'Romance',
                rating: 7.8,
                avalible: true,
            },
            {
                title: 'A Viagem de Chihiro',
                description:
                    'Uma garota de 10 anos vaga por um mundo governado por deuses, bruxas e espíritos, onde humanos são transformados em bestas.',
                duration: 125,
                genre: 'Animação',
                rating: 8.6,
                avalible: true,
            },
            {
                title: 'Interestelar',
                description:
                    'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
                duration: 169,
                genre: 'Ficção Científica',
                rating: 8.7,
                avalible: true,
            },
            {
                title: 'Parasita',
                description:
                    'A família Kim, desempregada, se infiltra aos poucos na vida da rica família Park, resultando em incidentes inesperados.',
                duration: 132,
                genre: 'Suspense',
                rating: 8.5,
                avalible: true,
            },
            {
                title: 'O Cavaleiro das Trevas',
                description:
                    'Batman, Gordon e Harvey Dent se unem para combater o Coringa, uma mente criminosa que quer ver Gotham queimar.',
                duration: 152,
                genre: 'Ação',
                rating: 9.0,
                avalible: true,
            },
            {
                title: 'A Origem',
                description:
                    'Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos recebe a tarefa inversa.',
                duration: 148,
                genre: 'Ficção Científica',
                rating: 8.8,
                avalible: true,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
