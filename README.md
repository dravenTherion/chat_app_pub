# Chat App 

A fun sample chat app using Laravel, React, Pusher and a dash of MongoDB
 
Check out the demo here: https://chat.madpolarlabs.com/

 
## Getting Started

Clone this [repository](https://github.com/dravenTherion/chat_app_pub.git) or download it as a [zip file](https://github.com/dravenTherion/chat_app_pub/archive/master.zip).
 
 
___ 
### Prerequisites 

Make sure to have these installed on your system before being able to run the sample:
 
*__Note:__* Run the sample commands in your project folder/git clone *(/source)*.
 
 
 
* __Composer__: 
   
   Use *Composer* to install or update dependencies in the project. Get it [here](https://getcomposer.org/download/). 
   
   *update using composer:*

   ```
   composer update
   ```
 
 
 
* __NPM__:

  Use *npm* to update the JavaScript dependencies or rebuild the frontend components when modified. Get it [here](https://www.npmjs.com/get-npm).
  
  *update using npm:*
  ```
  npm update
  ```
  
  *build using npm:*
  ```
  npm run dev
  ```
   
 
  
* __Pusher__:
 
  Create an account with *Pusher* in order to be able to use it's realtime engine services and send message through the app. Sign up [here](https://pusher.com/).
  
  Once signed-up, sample codes are also provided by Pusher for your platforms of choice. 
  
  *install using npm (for the React side)*
  ```
  npm install pusher-js
  ```
  
  
  *install using composer (for the Laravel side)*
  ```
  composer require pusher/pusher-php-server
  ```
  
  
 
* __MongoDB__:

  In order for the MongoDB to work with Laravel, [jenssegers](https://github.com/jenssegers)' laravel-mongodb library will also need to be installed. Check it out [here](https://github.com/jenssegers/laravel-mongodb).
  
  In most cases, the installation will already be handled by `composer update`, however with XAMPP based environments, the MongoDB driver still needs to be downloaded and installed.
  
  For a list of compatible drivers, check this link: https://pecl.php.net/package/mongodb
  
  
  After downloading the driver/DLL, copy and paste it to the PHP extensions folder: 
  
  *Assuming __XAMPP__ is installed in C:*
  ```
  C:\xampp\php\ext
  ```
  
  and modify php.ini to include the following line:
  ```
  extension=php_mongo.dll
  ```
  
  Restart Apache afterwards.
  
  
___  
### Installation and Initial Setup


1. After downloading or cloning the repository, locate the `source` folder and update the PHP dependencies: 

   ```
   composer update
   ```

2. Update the JavaScript dependencies using

   ```
   npm update
   ```

3. In the same folder, create an `.env` file from `.env.example`.


4. Generate a new application key for laravel using:
   ```
   php artisan key:generate
   ```
   
5. Open the `.env` file and update the settings:
  
   * MongoDB Settings: 
   
     ```
     MONGO_DB_DATABASE=YOUR_DBASE_NAME
     MONGO_DB_USERNAME=YOUR_DBASE_USERNAME
     MONGO_DB_PASSWORD=YOUR_DBASE_PASSOWORD
     ```
     
   * Pusher Settings:
     
     Using the settings provided by Pusher during your signup, update the following values:
     ```
     PUSHER_APP_ID=YOUR_PUSHER_APP_ID
     PUSHER_APP_KEY=YOUR_PUSHER_APP_KEY
     PUSHER_APP_SECRET=YOUR_PUSHER_APP_SECRET
     PUSHER_APP_CLUSTER=YOUR_PUSHER_APP_CLUSTER
     ```
     
6. Go to the `resources\js\components\Settings\` folder and create a `Config.js` file from the `Config.example.js`. 
   
   Update the contents with your Pusher settings:
   
   ```
   export default({
   pusherKey: 'YOUR_PUSHER_APP_ID',
   pusherCluster: 'YOUR_PUSHER_APP_CLUSTER',
   forceTLS: true
   })
   ```
   
7. Go back to the `source` folder and run:

   ```
   npm run dev
   ```
   
8. If you have a local setup, you can now run:

   ```
   php artisan serve
   ```
   
   and use the generated url to preview the app in your browser. *(e.g. http://127.0.0.1:8000)*
   
   
9. Enjoy! :smiley:
  
  
  
## Built with

* [Composer](https://getcomposer.org) - Dependency management
* [Laravel](https://laravel.com/) - PHP framework
* [React](https://reactjs.org/) - Frontend library
* [MongoDB](https://www.mongodb.com/) - database
* [Pusher](https://pusher.com/) - realtime engine
   
  
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
  
  
___
## Helpful Resources

* https://pusher.com/tutorials/chat-laravel
* https://dev.to/lvtdeveloper/using-react-in-a-laravel-application-8fp
* https://www.thegeekstuff.com/2015/10/php-mongodb-for-xampp/