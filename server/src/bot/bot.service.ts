import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  // @Hears('тест')
  // async onYes(@Ctx() ctx) {
  //   log(ctx.from);
  //   await ctx.reply('тест');
  // }
  writeMessageToUser(id: number, message: string) {
    this.bot.telegram.sendMessage(id, message);
  }
}
