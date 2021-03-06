import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import { SyntheticAccountsService } from './synthetic-accounts.service';
import {
  defaultSyntheticAccountGroups,
  syntAccountWithLinkedSyntAccountsAndSubAccountsGroups,
  syntAccountWithLinkedSyntAccountsGroups,
  syntAccountWithSubAccountsGroups,
  SyntheticAccountEntity
} from './serializers/synthetic-account.serializer';
import { EditSyntheticAccountDto } from './dtos/edit-synt-account.dto';
import { CreateSyntheticAccountDto } from './dtos/create-synt-account.dto';
import { defaultAccountGroups } from '../accounts/serializers/account.serializer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { ApiResponseError } from '../../common/errors/api-error.schema';
import {
  AtomicSyntheticAccount,
  SyntheticAccountWithLinkedSyntAccounts,
  SyntheticAccountWithSubAccounts,
  SyntheticAccountWithSubAccountsAndLinkedSyntAccounts
} from './documentation/synthetic-account.descriptors';
import { Public } from '../../common/decorators/routes-privacy.decorator';

@Controller('synthetic-accounts')
@ApiTags('synthetic-accounts')
export class SyntheticAccountsController {
  constructor(
    private readonly syntheticAccountsService: SyntheticAccountsService
  ) {}

  @Public()
  @Get('/')
  @ApiOkResponse({
    description: 'List of synthetic accounts',
    type: [AtomicSyntheticAccount]
  })
  @SerializeOptions({ groups: defaultSyntheticAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async get(): Promise<SyntheticAccountEntity[]> {
    return await this.syntheticAccountsService.getAll();
  }

  @Public()
  @Get('/single/:id')
  @ApiOkResponse({
    description: 'Synthetic account with provided id',
    type: AtomicSyntheticAccount
  })
  @ApiNotFoundResponse({
    description: "Synthetic account with provided id hasn't been found",
    type: ApiResponseError
  })
  @SerializeOptions({ groups: defaultSyntheticAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.getById(id);
  }

  @Public()
  @Get('/with-linked')
  @ApiOkResponse({
    description:
      'List of synthetic accounts with linked by debit and credit synthetic accounts',
    type: [SyntheticAccountWithLinkedSyntAccounts]
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithLinked(): Promise<SyntheticAccountEntity[]> {
    return await this.syntheticAccountsService.getAll([
      'byDebitAccounts',
      'byCreditAccounts'
    ]);
  }

  @Public()
  @Get('/with-linked/single/:id')
  @ApiOkResponse({
    description:
      'Synthetic account with provided id and linked by debit and credit synthetic accounts',
    type: SyntheticAccountWithLinkedSyntAccounts
  })
  @ApiNotFoundResponse({
    description: "Synthetic account with provided id hasn't been found",
    type: ApiResponseError
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithLinkedById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.getById(id, [
      'byDebitAccounts',
      'byCreditAccounts'
    ]);
  }

  @Public()
  @Get('/with-sub')
  @ApiOkResponse({
    description: 'List of synthetic accounts with linked sub-accounts',
    type: [SyntheticAccountWithSubAccounts]
  })
  @SerializeOptions({
    groups: syntAccountWithSubAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSub(): Promise<SyntheticAccountEntity[]> {
    return await this.syntheticAccountsService.getAll(['subAccounts']);
  }

  @Public()
  @Get('/with-sub/single/:id')
  @ApiOkResponse({
    description: 'Synthetic account with provided id and linked sub-accounts',
    type: SyntheticAccountWithSubAccounts
  })
  @ApiNotFoundResponse({
    description: "Synthetic account with provided id hasn't been found",
    type: ApiResponseError
  })
  @SerializeOptions({
    groups: syntAccountWithSubAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSubById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.getById(id, ['subAccounts']);
  }

  @Public()
  @Get('/with-sub-linked')
  @ApiOkResponse({
    description:
      'List of synthetic accounts with linked sub-accounts and linked by debit and credit synthetic accounts',
    type: [SyntheticAccountWithSubAccountsAndLinkedSyntAccounts]
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsAndSubAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSubAndLinked(): Promise<SyntheticAccountEntity[]> {
    return await this.syntheticAccountsService.getAll([
      'subAccounts',
      'byDebitAccounts',
      'byCreditAccounts'
    ]);
  }

  @Public()
  @Get('/with-sub-linked/single/:id')
  @ApiOkResponse({
    description:
      'Synthetic account with linked sub-accounts and linked by debit and credit synthetic accounts',
    type: SyntheticAccountWithSubAccountsAndLinkedSyntAccounts
  })
  @ApiNotFoundResponse({
    description: "Synthetic account with provided id hasn't been found",
    type: ApiResponseError
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsAndSubAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSubAndLinkedById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.getById(id, [
      'subAccounts',
      'byDebitAccounts',
      'byCreditAccounts'
    ]);
  }

  @ApiBearerAuth()
  @Post('/')
  @ApiCreatedResponse({
    description: 'Newly created synthetic account',
    type: AtomicSyntheticAccount
  })
  @ApiBadRequestResponse({
    description:
      'Passed creation body contains data, which contradicts to validation rules or database',
    type: ApiResponseError
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() inputs: CreateSyntheticAccountDto
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.create(inputs);
  }

  @ApiBearerAuth()
  @Put('/:id')
  @ApiCreatedResponse({
    description: 'Updated synthetic account',
    type: AtomicSyntheticAccount
  })
  @ApiBadRequestResponse({
    description:
      'Passed editing body contains data, which contradicts to validation rules or database',
    type: ApiResponseError
  })
  @SerializeOptions({
    groups: syntAccountWithLinkedSyntAccountsGroups
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() inputs: EditSyntheticAccountDto
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.update(id, inputs);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  @ApiOkResponse({
    description: 'Deleted synthetic account',
    type: AtomicSyntheticAccount
  })
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SyntheticAccountEntity> {
    return await this.syntheticAccountsService.delete(id);
  }
}
