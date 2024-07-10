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
    try {
      this.bot.telegram.sendMessage(id, message);
    } catch (error) {
      log(error);
    }
  }

  writeMessageToUserWithLinkButton(
    id: number,
    message: string,
    link: string,
    label: string,
  ) {
    try {
      this.bot.telegram.sendMessage(id, message, {
        reply_markup: {
          inline_keyboard: [[{ text: label, url: link }]],
        },
      });
    } catch (error) {
      log(error);
    }
  }
}
