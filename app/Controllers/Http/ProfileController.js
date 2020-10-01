'use strict'

const Helpers = use('Helpers');

class ProfileController {

    async update({ request, auth }) {

        //Permite atualizar somente os campos descritos na variável 'data' abaixo
        const data = request.only([
            'username'          
        ]);

        const user = await auth.getUser();

        const avatar = request.file('avatar', {
            types: ['image'],
            size: '2mb'
          });
        
        if (avatar){
            
            await avatar.move(Helpers.tmpPath('uploads'), {
                name: `${new Date().getTime()}.${avatar.subtype}`,               
            });          

            if (!avatar.moved()) {
                return avatar.error()
            }

            user.avatar = avatar.fileName;            
        }

        //Merge permite atualizar varios campos de uma só vez.    
        user.merge(data);

        const password = request.input('password');
        if (password) {
            user.password = password;
        }

        await user.save();

        return user;
    }

}

module.exports = ProfileController
