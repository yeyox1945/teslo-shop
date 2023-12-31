import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiBadRequestResponse, ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User token still active', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  // Authetication required
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User, // Custom decorator
    @GetUser('email') userEmail: string, // Custom decorator
    @RawHeaders() rawHeaders: string[], // Custom decorator
    @Req() request: Express.Request,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log({ request });
    return {
      ok: true,
      user,
      userEmail,
      rawHeaders,
      headers
    };
  }


  // Authentication and Authorization required (roles)
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin) //  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }


  // Single @Auth() decorator to handle both Authentication guard and Authorization guards (roles)
  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }

}
