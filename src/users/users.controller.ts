import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/createuser.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/users.entity';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { ChangePasswordDto } from './dtos/changeUserPassword.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/paginationQuery.dto';
import { CreateManyUsersDto } from './dtos/createManyUsers.dto';
import { DeleteManyUsersDto } from './dtos/deleteManyUsers.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/roles.enum';
import { IsPublic } from 'src/auth/decorators/public.decorator';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // SIGN UP
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @IsPublic()
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000 * 10, // 5 requests per 10 mins
    },
  })
  @ApiOperation({
    summary: 'registers a new user',
    description:
      'creates an account for the user and returns user details upon success',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or invalid input',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Please try again later',
  })
  public async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.signup(createUserDto);
  }

  // CHANGE USER PASSWORD ENDPOINT
  @Post('change-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000 * 30, // 5 requests every 30 mins
    },
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change user password',
    description: 'User successfully changes their password from this endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'User password changed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many attempts. Please try again later',
  })
  public async changeUserPassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changeUserPassword(
      user.email,
      changePasswordDto,
    );
  }

  // FIND ALL USERS
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieves all users',
    description: 'Get all the users in the database',
  })
  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully',
  })
  public async findAllUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.usersService.findAllUsers(paginationQueryDto);
  }

  // FIND ONE USER
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieves a single user based on id',
    description: 'Get a single user using their id',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  public async findSingleUser(@Param('id') id: string) {
    return await this.usersService.findOneUser(id);
  }

  // UPDATE SINGLE USER
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a single user',
    description: 'Update a single user using the id of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public async updateSingleUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOneUser(id, updateUserDto);
  }

  // DELETE A USER
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user',
    description: 'This endpoint deletes a user based on their provided id',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public async deleteSingleUser(@Param('id') id: string) {
    return await this.usersService.deleteOneUser(id);
  }

  // CREATE MANY USERS
  @Post('create-multiple')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  public async createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return await this.usersService.createManyUsers(createManyUsersDto);
  }

  // DELETE MANY USERS
  @Delete('delete-multiple')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  public async deleteManyUsers(@Body() deleteManyUsersDto: DeleteManyUsersDto) {
    return await this.usersService.deleteManyUsers(deleteManyUsersDto);
  }
}
