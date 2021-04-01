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
        stage('Test') { 
            steps { 
                sh 'eslint *.js' 
            }
        }
        stage('Deploy') { 
            steps { 
                sh 'sudo ./deploy.sh'
            }
        }
    }
}