import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { BorrowRequestsService } from './borrow-requests.service';

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateBorrowRequestDto,
  ) {
    return this.borrowRequestsService.create(request.user.id, data);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.LIBRARIAN)
  findAll() {
    return this.borrowRequestsService.findAll();
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.LIBRARIAN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBorrowRequestDto,
  ) {
    return this.borrowRequestsService.update(id, data);
  }
}
