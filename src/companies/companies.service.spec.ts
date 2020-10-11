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
    findById: jest.fn(),
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
    mockModel.findById.mockReset();
    mockModel.findByIdAndUpdate.mockReset();


  });

  describe('When update Company', () => {
    it('should update a company', async () => {

      const companyUpdated = {name: 'Companhia B'};

      mockModel.findById.mockReturnValue(validCompany);
      mockModel.findOne.mockReturnValue(validCompany);
      mockModel.findByIdAndUpdate.mockReturnValue({
        ...validCompany,
        ...companyUpdated
      });

      await service.updateCompany(validCompany._id, {...validCompany, name: companyUpdated.name});

      expect(mockModel.findById).toHaveBeenCalledTimes(1);
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      
    });

    it('should return a exception when updating with an existing company name', async () => {
      const companyUpdated = {name: 'Companhia B'};

      mockModel.findById.mockReturnValue(validCompany);
      mockModel.findByIdAndUpdate.mockReturnValue(null);
      
      await service.updateCompany('123', {...validCompany, name: companyUpdated.name}).catch(exception => {
        expect(exception).toBeInstanceOf(BadRequestException);
      })
    
      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });
  })
  
  describe('When search all Companies', () => {
    it('should be list all companies', async () => {

      mockModel.find.mockReturnValue([validCompany, validCompany]);
      
      const companiesFound = await service.findAllCompanies();

      expect(companiesFound).toHaveLength(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('When search Company by Id', () => {
    it('should be find a existing company', async () => {
    
      mockModel.findById.mockReturnValue(validCompany);

      const companyFound = await service.findCompanyByIdOrThrow('1');
  
      expect(companyFound).toMatchObject({name: validCompany.name});
      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not to find a company', async () => {
      mockModel.findById.mockReturnValue(null);
      expect(service.findCompanyByIdOrThrow('1111')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });
  })

  
});
