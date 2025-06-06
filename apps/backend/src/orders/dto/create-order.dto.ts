import { IsString, IsOptional, IsArray, ValidateNested, IsUUID, IsInt, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Menu item ID', example: 'uuid-string' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity of the item', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Special notes for this item', example: 'No onions' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'Customer name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Customer email', example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Order notes', example: 'Table 5' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Array of order items',
    type: [CreateOrderItemDto],
    example: [{ menuItemId: 'uuid-string', quantity: 2, notes: 'Extra spicy' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
} 