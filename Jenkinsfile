pipeline { 
    agent any 
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Build') { 
            steps { 
                sh 'npm i' 
            }
        }
        stage('Deploy') {
            steps {
                sh 'node server.js'
            }
        }
    }
}