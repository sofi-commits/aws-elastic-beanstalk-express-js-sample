pipeline {
    agent none

    environment {
        IMAGE_NAME = "isofian/isec6000-assessment2-app"
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {

        // Install, test, and scan all run inside a Node 16 container,
        // as the brief requires. They share this one stage's block
        // so they run in the same workspace, meaning node_modules
        // installed here is still there for the test and audit steps.
        stage('Build, Test, and Scan') {
            agent {
                docker { image 'node:16' }
            }
            stages {
                stage('Install Dependencies') {
                    steps {
                        sh 'npm install'
                        archiveArtifacts artifacts: 'package.json, package-lock.json', allowEmptyArchive: true
                    }
                }
                stage('Run Unit Tests') {
                    steps {
                        sh 'npm test'
                    }
                }
                stage('Dependency Vulnerability Scan') {
                    steps {
                        // npm audit exits non-zero if it finds vulnerabilities
                        // at or above the given severity, which Jenkins reads
                        // as a failed step, failing the whole pipeline. This
                        // is the actual security gate the brief asks for.
                        sh 'npm audit --audit-level=high'
                    }
                }
            }
        }

        // These two run directly on the Jenkins controller itself, not
        // a Node container, since the controller already has the Docker
        // CLI installed and is already configured to talk to the DinD
        // sidecar over TLS, from the Compose setup in Task 2.
        stage('Build Docker Image') {
            agent any
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Push Docker Image') {
            agent any
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                }
            }
        }
    }
}
