pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "dovanminh98"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/k8s-lab-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/k8s-lab-frontend"
        IMAGE_TAG = "v${BUILD_NUMBER}"
        GIT_REPO = "https://github.com/minhdevops/k8s-lab-webapp.git"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:$IMAGE_TAG ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:$IMAGE_TAG ./frontend'
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $BACKEND_IMAGE:$IMAGE_TAG
                    docker push $FRONTEND_IMAGE:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Update Helm values.yaml') {
            steps {
                sh '''
                sed -i "/backend:/,/frontend:/ s/tag:.*/tag: \\"$IMAGE_TAG\\"/" helm/k8s-lab-webapp/values.yaml
                sed -i "/frontend:/,$ s/tag:.*/tag: \\"$IMAGE_TAG\\"/" helm/k8s-lab-webapp/values.yaml
                cat helm/k8s-lab-webapp/values.yaml
                '''
            }
        }

        stage('Push GitOps Change') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {
                    sh '''
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"

                    git add helm/k8s-lab-webapp/values.yaml
                    git commit -m "Update image tag to $IMAGE_TAG" || echo "No changes"

                    git push https://$GIT_USER:$GIT_TOKEN@github.com/minhdevops/k8s-lab-webapp.git HEAD:main
                    '''
                }
            }
        }
    }
}