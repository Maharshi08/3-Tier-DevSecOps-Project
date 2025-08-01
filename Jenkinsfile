pipeline {
    agent any
    tools {
        nodejs 'nodejs24'
    }
    stages {
        stage('Check File Loaded') {
            steps {
                echo '✅ Jenkinsfile loaded and running!'
            }
        }
        stage('Frontend Compilation') {
            steps {
                dir('client') {
                    sh 'find . -name "*.js" -exec node --check {} +'
                }
            }
        }
        stage('Backend Compilation') {
            steps {
                dir('api') {
                    sh 'find . -name "*.js" -exec node --check {} +'
                }
            }
        }
    }
}
