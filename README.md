# InterCraft Launcher
The official launcher for InterCraft

## Development
These steps will get you started with setting up the development environment.

#### Install Node.js
It is highly recommended that you install [Node.js](https://nodejs.org/) version 6.10 or above.
You can check your installation by running the following in a command line interface:

```
node -v
```

#### Install Gulp and Electron
The launcher is powered by Electron, and uses Gulp to compile the source code. They can be installed by running the following commands:

```
npm install electron -g
npm install gulp-cli -g
npm install gulp -D
```
And of course you can check the installations by running:
```
electron -v
gulp -v
```


#### Clone the Repository
Once you have Node.js setup, you can now clone the repository by running the following command in a Git bash or terminal:
```
git clone https://github.com/InterCraftOfficial/InterCraftLauncher
```


#### Install Dependencies
You will now need to install the required dependencies to run the launcher. Inside the `InterCraftLauncher` directory, execute the following command:
```
npm install
```
This will install all of the necessary Node modules for the launcher to run.


#### Building and Running the Launcher
A Gulp file is used to build and run the launcher. You can build and run the launcher now by running the following command:
```
gulp start
```
This will compile all of the source code and resources, and execute the launcher.
