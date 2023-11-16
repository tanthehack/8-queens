const populationSize = 10;
const mutationRate = 0.1;
const GENERATIONS = 10000;

//initialize first population
let population = initializePopulation(populationSize);

//initialize all chessboards
displayChessboard()
displayChessboard(null, true)

// display initial configuration on the first chessboard
displayChessboard(population[0].chromosome, true);

// initialize counter for max generations
let counter = 1;

//interval for each generation in 1 nanosecond 
const interval = setInterval(() => {
    counter += 1; // inc counter on every loop iteration

    population = evolve(population, mutationRate); // evolve current population, with mutation rate

    population.sort((a, b) => b.fitness - a.fitness); // sort through the population from descending order of their fitness scores

    displayChessboard(population[0].chromosome, false); // display chessboard for current generation

    //control to break out of the interval if max generations has been met or best solution has been met
    if (calculateFitness(population[0].chromosome) == 28 || counter === GENERATIONS) {
        console.log('best:', population[0].chromosome, 'fitness:', calculateFitness(population[0].chromosome));
        clearInterval(interval);
    }

}, 100);

// initial population function
function initializePopulation(populationSize) {
    const population = [];

    for (let i = 0; i < populationSize; i++) {
        population.push(createIndividual());
    }

    return population;
}

// Creates individual[obj] with the chromosome and fitness score
function createIndividual(ch) {
    const chromosome = ch ?? generateChromosome();
    return {
        chromosome: chromosome,
        fitness: calculateFitness(chromosome),
    };
}

// randomly generates numbers from 0 - 7 for a chromosome
function generateChromosome() {
    const chromosome = [];
    for (let i = 0; i < 8; i++) {
        chromosome.push(Math.floor(Math.random() * 8));
    }
    return chromosome;
}

// calc fitness score by checking number of conflicts on each queen. 
// best fitness score is 28, the worst score is zero
function calculateFitness(chromosome) {
    let clashes = 0; // counter for attack on current queen

    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
            if (
                chromosome[i] === chromosome[j] || // same row
                Math.abs(chromosome[i] - chromosome[j]) === Math.abs(i - j) // same diag
            ) {
                clashes++;
            }
        }
    }
    return 28 - clashes; // Max fitness is 28, as there are 28 non-attacking pairs of queens.
}

function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * 8); // choose randomly a point on the two chessboards

    // from 0 to the crossover point for parent 1 && crossover point to then end of parent 2
    const childChromosome = [...parent1.chromosome.slice(0, crossoverPoint), ...parent2.chromosome.slice(crossoverPoint)];

    return createIndividual(childChromosome);
}

//Mutation function to add variation to the chromosomes
function mutate(individual, mutationRate) {
    for (let i = 0; i < 8; i++) {
        // mutation rate is the value at which a row in a chromosome would be changed
        // checks a random number between 0 and 1 with the mutation rate and changes a row based on the condition
        if (Math.random() < mutationRate) {
            individual.chromosome[i] = Math.floor(Math.random() * 8);
        }
    }
}

function selectParent(population) {
    const index1 = Math.floor(Math.random() * population.length); //selects a random chromosome from the population
    return population[index1];
}

function evolve(population, mutationRate) {
    const newPopulation = [];

    const bestPopulation = population.slice(0, population.length / 2) // Picks the best 5 chromosomes

    for (let i = 0; i < population.length; i++) {
        const parent1 = selectParent(bestPopulation);
        const parent2 = selectParent(bestPopulation);

        const child = crossover(parent1, parent2);

        mutate(child, mutationRate);

        newPopulation.push(child); // push new mutated chromosome into the new population arr
    }

    return newPopulation;
}

// display chessboard function
function displayChessboard(chromosome, isInitial) {
    const chessboard = document.getElementById(isInitial ? 'initial-chessboard' : 'chessboard');

    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {

            if (chromosome == null) {
                const square = document.createElement('div');

                square.className = "square light"

                if ((col % 2 === 0 && row % 2 === 1) || (col % 2 === 1 && row % 2 === 0)) {
                    square.className = "square dark"
                }
                chessboard.appendChild(square);

                continue;
            }

            chessboard.childNodes[row * 8 + col].textContent = chromosome[row] === col ? '♛' : '';
        }
    }
}
