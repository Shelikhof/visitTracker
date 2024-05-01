import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Hears('да')
  async onYes(@Ctx() ctx) {
    log(ctx.from);
    await ctx.reply('ПИЗДА ГАГАГА');
  }

  @Hears('иди нахуй')
  async asd(@Ctx() ctx) {
    log(ctx.from);
    await ctx.reply('СОСИ ОЧКО');
  }

  writeMessageToUser(id: number, message: string) {
    this.bot.telegram.sendMessage(id, message);
  }
}
