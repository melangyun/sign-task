import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './modules/shared/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Signature shared program")
    .setDescription("API Documents about Signature shared program")
    .setVersion("1.0")
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api", app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  const port:any = process.env.PORT;
  await app.listen(port);
  console.log(`app listen on : ${port}`)

}
bootstrap();

export default bootstrap;