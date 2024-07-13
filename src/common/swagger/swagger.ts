import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDescription } from './swagger.description';

export function SetSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('BE-FRAMEWORK-NEST')
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
