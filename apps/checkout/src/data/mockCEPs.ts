/**
 * Mock CEP Data - Real Brazilian ZIP codes for testing
 * Includes major cities from different states
 */

export interface CEPData {
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
}

export const mockCEPs: CEPData[] = [
  { cep: '01310-100', city: 'São Paulo', state: 'SP', neighborhood: 'Bela Vista', street: 'Avenida Paulista' },
  { cep: '01311-000', city: 'São Paulo', state: 'SP', neighborhood: 'Bela Vista', street: 'Rua Augusta' },
  { cep: '01452-000', city: 'São Paulo', state: 'SP', neighborhood: 'Jardins', street: 'Rua Oscar Freire' },
  { cep: '05508-000', city: 'São Paulo', state: 'SP', neighborhood: 'Butantã', street: 'Avenida Vital Brasil' },
  { cep: '04543-907', city: 'São Paulo', state: 'SP', neighborhood: 'Vila Olímpia', street: 'Avenida Juscelino Kubitschek' },
  { cep: '20040-020', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Centro', street: 'Avenida Rio Branco' },
  { cep: '22010-000', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Copacabana', street: 'Avenida Atlântica' },
  { cep: '22250-040', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Botafogo', street: 'Praia de Botafogo' },
  { cep: '22290-140', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Urca', street: 'Avenida João Luís Alves' },
  { cep: '22640-102', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Barra da Tijuca', street: 'Avenida das Américas' },
  { cep: '70040-020', city: 'Brasília', state: 'DF', neighborhood: 'Asa Sul', street: 'SQS 102' },
  { cep: '70710-500', city: 'Brasília', state: 'DF', neighborhood: 'Asa Norte', street: 'SQN 202' },
  { cep: '71020-520', city: 'Brasília', state: 'DF', neighborhood: 'Sudoeste', street: 'SQSW 100' },
  { cep: '72000-000', city: 'Brasília', state: 'DF', neighborhood: 'Ceilândia', street: 'Avenida Hélio Prates' },
  { cep: '30130-010', city: 'Belo Horizonte', state: 'MG', neighborhood: 'Centro', street: 'Avenida Afonso Pena' },
  { cep: '30360-000', city: 'Belo Horizonte', state: 'MG', neighborhood: 'Savassi', street: 'Rua Pernambuco' },
  { cep: '31270-901', city: 'Belo Horizonte', state: 'MG', neighborhood: 'Pampulha', street: 'Avenida Portugal' },
  { cep: '30190-922', city: 'Belo Horizonte', state: 'MG', neighborhood: 'Funcionários', street: 'Rua dos Guajajaras' },
  { cep: '40020-000', city: 'Salvador', state: 'BA', neighborhood: 'Centro', street: 'Praça Municipal' },
  { cep: '40140-130', city: 'Salvador', state: 'BA', neighborhood: 'Barra', street: 'Avenida Oceânica' },
  { cep: '41810-011', city: 'Salvador', state: 'BA', neighborhood: 'Itapuã', street: 'Rua da Música' },
  { cep: '41301-110', city: 'Salvador', state: 'BA', neighborhood: 'Iguatemi', street: 'Avenida Tancredo Neves' },
  { cep: '60060-610', city: 'Fortaleza', state: 'CE', neighborhood: 'Centro', street: 'Avenida Dom Manuel' },
  { cep: '60165-121', city: 'Fortaleza', state: 'CE', neighborhood: 'Meireles', street: 'Avenida Beira Mar' },
  { cep: '60115-221', city: 'Fortaleza', state: 'CE', neighborhood: 'Aldeota', street: 'Avenida Santos Dumont' },
  { cep: '60810-670', city: 'Fortaleza', state: 'CE', neighborhood: 'Praia do Futuro', street: 'Avenida Zezé Diogo' },
  { cep: '80020-100', city: 'Curitiba', state: 'PR', neighborhood: 'Centro', street: 'Rua XV de Novembro' },
  { cep: '80250-030', city: 'Curitiba', state: 'PR', neighborhood: 'Batel', street: 'Avenida Batel' },
  { cep: '82640-000', city: 'Curitiba', state: 'PR', neighborhood: 'Cajuru', street: 'Rua Pedro Violani' },
  { cep: '80230-130', city: 'Curitiba', state: 'PR', neighborhood: 'Água Verde', street: 'Rua Ney Braga' },
  { cep: '50010-000', city: 'Recife', state: 'PE', neighborhood: 'Recife', street: 'Praça do Marco Zero' },
  { cep: '51020-010', city: 'Recife', state: 'PE', neighborhood: 'Boa Viagem', street: 'Avenida Boa Viagem' },
  { cep: '50670-901', city: 'Recife', state: 'PE', neighborhood: 'Pina', street: 'Avenida Herculano Bandeira' },
  { cep: '50740-530', city: 'Recife', state: 'PE', neighborhood: 'Espinheiro', street: 'Rua Real da Torre' },
  { cep: '90010-150', city: 'Porto Alegre', state: 'RS', neighborhood: 'Centro', street: 'Avenida Borges de Medeiros' },
  { cep: '90470-001', city: 'Porto Alegre', state: 'RS', neighborhood: 'Moinhos de Vento', street: 'Rua Ramiro Barcelos' },
  { cep: '91040-001', city: 'Porto Alegre', state: 'RS', neighborhood: 'Restinga', street: 'Estrada João Antônio da Silveira' },
  { cep: '90540-001', city: 'Porto Alegre', state: 'RS', neighborhood: 'Petrópolis', street: 'Rua Mostardeiro' },
  { cep: '69005-141', city: 'Manaus', state: 'AM', neighborhood: 'Centro', street: 'Avenida Eduardo Ribeiro' },
  { cep: '69057-070', city: 'Manaus', state: 'AM', neighborhood: 'Adrianópolis', street: 'Avenida Djalma Batista' },
  { cep: '69010-060', city: 'Manaus', state: 'AM', neighborhood: 'Centro', street: 'Avenida 7 de Setembro' },
  { cep: '69093-415', city: 'Manaus', state: 'AM', neighborhood: 'Cidade Nova', street: 'Avenida Noel Nutels' },
  { cep: '66010-000', city: 'Belém', state: 'PA', neighborhood: 'Campina', street: 'Avenida Presidente Vargas' },
  { cep: '66055-090', city: 'Belém', state: 'PA', neighborhood: 'Nazaré', street: 'Avenida Governador José Malcher' },
  { cep: '66093-020', city: 'Belém', state: 'PA', neighborhood: 'Umarizal', street: 'Travessa Rui Barbosa' },
  { cep: '66115-200', city: 'Belém', state: 'PA', neighborhood: 'Marco', street: 'Avenida Almirante Barroso' },
];

/**
 * Search CEPs by city, neighborhood, or street
 * Case-insensitive and accent-insensitive fuzzy search
 */
export const searchCEPs = (query: string): CEPData[] => {
  if (!query || query.length < 2) {
    return mockCEPs;
  }

  const normalizedQuery = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics

  return mockCEPs.filter((cep) => {
    const searchText = `${cep.city} ${cep.state} ${cep.neighborhood} ${cep.street}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return searchText.includes(normalizedQuery);
  });
};

export const getUniqueStates = (): string[] => {
  return Array.from(new Set(mockCEPs.map((cep) => cep.state))).sort();
};

export const getCitiesByState = (state: string): string[] => {
  return Array.from(
    new Set(mockCEPs.filter((cep) => cep.state === state).map((cep) => cep.city))
  ).sort();
};
export const filterCEPs = (state?: string, city?: string): CEPData[] => {
  let filtered = mockCEPs;

  if (state) {
    filtered = filtered.filter((cep) => cep.state === state);
  }

  if (city) {
    filtered = filtered.filter((cep) => cep.city === city);
  }

  return filtered;
};

