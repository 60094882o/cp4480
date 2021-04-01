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
        stage('Testing') { 
            steps { 
                sh 'eslint *.js' 
            }
        }
    }
}