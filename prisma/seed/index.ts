import { prisma } from '../../src/prisma';

async function main() {
  await prisma.dataPoint.createMany({
    data: [
      {
        key: 'name',
        type: 'String',
      },
      {
        key: 'shortname',
        type: 'String',
      },
      {
        key: 'competitorLimit',
        type: 'Number',
        validation: 'Nonzero',
      },
      {
        key: 'schedule.startDate',
        type: 'String',
        validation: 'Date',
      },
      {
        key: 'schedule.numberOfDays',
        type: 'Number',
        validation: 'Nonzero',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
