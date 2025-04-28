import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  createParamDecorator,
  ExecutionContext,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { User } from "../interfaces/user.interface";

// Create a custom decorator
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiTags("users")
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "filter", required: false, type: String })
  findAll(
    @Req() req: Request,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("filter") filter?: string
  ) {
    return this.usersService.findAll({ page, limit, filter });
  }

  @Get("staff")
  findStaff(@Req() req: Request) {
    return this.usersService.findStaff(req.user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: Request) {
    return this.usersService.remove(id, req.user);
  }
}
