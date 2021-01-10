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
import {
  AccountEntity,
  accountGroupsWithSynthetic,
  defaultAccountGroups
} from './serializers/account.serializer';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { EditAccountDto } from './dtos/edit-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async get(): Promise<AccountEntity[]> {
    return await this.accountsService.getAll();
  }

  @Get('/single/:id')
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: string): Promise<AccountEntity> {
    return await this.accountsService.get(id);
  }

  @Get('/with-synthetic')
  @SerializeOptions({ groups: accountGroupsWithSynthetic })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSynthetic(): Promise<AccountEntity[]> {
    return await this.accountsService.getAll(['syntheticAccounts']);
  }

  @Get('/with-synthetic/single/:id')
  @SerializeOptions({ groups: accountGroupsWithSynthetic })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWithSyntheticById(
    @Param('id', ParseIntPipe) id: string
  ): Promise<AccountEntity> {
    return await this.accountsService.get(id, ['syntheticAccounts']);
  }

  @Post('/')
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() inputs: CreateAccountDto): Promise<AccountEntity> {
    return await this.accountsService.create(inputs);
  }

  @Put('/:id')
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() inputs: EditAccountDto
  ): Promise<AccountEntity> {
    const account = await this.accountsService.get(id, [], true);
    return await this.accountsService.update(account, inputs);
  }

  @Delete('/:id')
  @SerializeOptions({ groups: defaultAccountGroups })
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: string): Promise<AccountEntity> {
    return await this.accountsService.delete(id);
  }
}
