import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';

const validCompany = {
  _id: '1782189has8d18',
  name: 'Companhia ABC'
}


describe('CompaniesService', () => {
  let service: CompaniesService;
  const mockModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn()    
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken('Company'),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  beforeEach(() => {
    mockModel.findOne.mockReset();
    mockModel.create.mockReset();
    mockModel.save.mockReset();
    mockModel.find.mockReset();
    mockModel.findByIdAndUpdate.mockReset();

  });

  describe('createCompany', () => {
    it('should create a company', async () => {

      mockModel.create.mockReturnValue(validCompany);

      const savedCompany = await service.createCompany(validCompany);
      
      expect(savedCompany).toMatchObject(validCompany);
      expect(mockModel.create).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('updateCompany', () => {
    it('should update a company', async () => {

      const companyUpdated = {name: 'Companhia B'};

      mockModel.findOne.mockReturnValue(validCompany);
      mockModel.findByIdAndUpdate.mockReturnValue({
        ...validCompany,
        ...companyUpdated
      });

      await service.updateCompany(validCompany._id, {...validCompany, name: 'Companhia B'});

      expect(mockModel.findOne).toHaveBeenCalledTimes(2);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      
    });

    it('should return a exception when updating with an existing company name', async () => {
      const companyUpdated = {name: 'Companhia B'};

      mockModel.findOne.mockReturnValue(validCompany);
      mockModel.findByIdAndUpdate.mockReturnValue({
        ...validCompany,
        ...companyUpdated
      });
      
      expect(service.updateCompany('123', {...validCompany, name: validCompany.name})).rejects.toBeInstanceOf(BadRequestException);
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
    });
  })
  
  describe('findAll', () => {
    it('should be list all companies', async () => {

      mockModel.find.mockReturnValue([validCompany, validCompany]);
      
      const ret = await service.findAllCompanies();

      expect(ret).toHaveLength(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('findByIdOrThrow', () => {
    it('should be find a existing company', async () => {
    
      mockModel.findOne.mockReturnValue(validCompany);

      const companyFound = await service.findCompanyByIdOrThrow('1');
  
      expect(companyFound).toMatchObject({name: validCompany.name});
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not to find a company', async () => {
      mockModel.findOne.mockReturnValue(null);
      expect(service.findCompanyByIdOrThrow('1111')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    });
  })

  
});
