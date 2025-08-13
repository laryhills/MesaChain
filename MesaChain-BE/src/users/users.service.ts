import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole as UserRoleInterface } from '../interfaces/user.interface';
import { AuditService } from '../auth/services/audit.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService
  ) { }

  async findAll(currentUser: any) {
    if (currentUser.role !== UserRoleInterface.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (currentUser.id !== id && currentUser.role !== UserRoleInterface.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Only admins can change roles
    let roleChanged = false;
    let oldRole = user.role;
    if (dto.role && currentUser.role !== UserRoleInterface.ADMIN) {
      delete dto.role;
    } else if (dto.role && dto.role !== user.role) {
      roleChanged = true;
    }

    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log role change if it occurred
    if (roleChanged && dto.role) {
      await this.auditService.logRoleChange(
        id,
        oldRole,
        dto.role,
        currentUser.id,
        `Role changed from ${oldRole} to ${dto.role}`
      );
    }

    return updatedUser;
  }

  async remove(id: string, currentUser: any) {
    if (currentUser.role !== UserRoleInterface.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async findStaff(currentUser: any) {
    if (currentUser.role !== UserRoleInterface.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }

    return this.prisma.user.findMany({
      where: {
        role: UserRoleInterface.STAFF,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
} 