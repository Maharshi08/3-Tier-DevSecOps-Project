pipeline {
  agent any

  tools {
    nodejs 'nodejs24' // Or your configured NodeJS tool name in Jenkins
  }                                                                                                                                                                                                                                                                                                                          qq
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Frontend Compilation') {
      steps {aaaaaaaaaa
        dir('client') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Backend Compilation') {
      steps {
        dir('api') {
          sh 'npm install'
        }
      }
    }
    stage('Test') {
      steps {
        dir('api') {
          sh 'npm test' // Change this to your backend test command
        }
      }
    }
  }
}
