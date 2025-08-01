pipeline {
  agent any
  tools { nodejs 'nodejs24' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Frontend Build') {
      steps {
        dir('client') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Backend Build & Test') {
      steps {
        dir('api') {
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
