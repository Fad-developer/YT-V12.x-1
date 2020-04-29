module.exports = {
  name: 'purge',
  description: 'Menghapus hingga 99 pesan.',
  cooldown: 5,
  args: true,
  aliases: ['clear', 'hapus'],
  execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {//ini jika argumen yang di ketik bukan angka
      return mesage.reply('masukkan jumlah pesan yang ingin dihapus');
    } else if (amount <= 1 || amount > 100) {
      return message.reply('Kamu bisa menghapus pesan 1-99');
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send('Ada kesalahan saat mencoba menghapus pesan di channel ini!');
    });
  },
};
