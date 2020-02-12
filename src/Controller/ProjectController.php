<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Session;
use App\Form\ProjectType;
use App\Repository\ProjectRepository;
use App\Repository\SessionRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @Route("/")
 */
class ProjectController extends AbstractController
{
    /**
     * @Route("/", name="project_index", methods={"GET"})
     */
    public function index(ProjectRepository $projectRepository): Response
    {
        return $this->render('project/index.html.twig', [
            'projects' => $projectRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="project_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $project = new Project();
        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($project);
            $entityManager->flush();

            return $this->redirectToRoute('project_show', [
                'id' => $project->getId()
            ]);
        }

        $referer = $request->headers->get('referer');

        return $this->render('project/new.html.twig', [
            'project' => $project,
            'form' => $form->createView(),
            'referer' => $referer
        ]);
    }

    /**
     * @Route("/{id}", name="project_show", methods={"GET"}, options={ "expose" : true })
     */
    public function show(Project $project): Response
    {
        return $this->render('project/show.html.twig', [
            'project' => $project,
        ]);
    }

    /**
     * @Route("/sessions/{id}", name="project_sessions", methods={"GET","POST"}, options={ "expose" : true })
     */
    public function sessions(Request $request, Project $project): Response
    {      
        if( !$request->isXmlHttpRequest() ) throw new NotFoundHttpException();
        
        $sessions = [];
        foreach( $project->getSessions() as $session ) {
            $sessions[] = [ "date" => $session->getDate(), "time" => $session->getTime() ];
        }
        return $this->json( $sessions );
    }

    /**
     * @Route("/{id}/session", name="project_session", methods={"GET","POST"}, options={ "expose" : true })
     */
    public function session(Request $request, Project $project, SessionRepository $sessionRepository): Response
    {   
        if( $request->isXmlHttpRequest() ) {
            $time = $request->request->get('time');
            if( null == $time ) return $this->json('Error : missing POST parameter "time".', 500);

            $date = new \DateTime();
            $session = $sessionRepository->findOneBy( [ "date" => $date, "project" => $project->getId() ] );
            if( null == $session ){
                $session = new Session();
                $project->addSession( $session );
                $session->setDate( $date );
            }
            $session->setTime( $session->getTime() + $time );

            $this->getDoctrine()->getManager()->flush();

            return $this->json(true);
        }

        return $this->render('project/session.html.twig', [
            'project' => $project,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="project_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Project $project): Response
    {
        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('project_show', [
                'id' => $project->getId()
            ]);
        }

        $referer = $request->headers->get('referer');

        return $this->render('project/edit.html.twig', [
            'project' => $project,
            'form' => $form->createView(),
            'referer' => $referer
        ]);
    }

    /**
     * @Route("/{id}", name="project_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Project $project): Response
    {
        if ($this->isCsrfTokenValid('delete'.$project->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($project);
            $entityManager->flush();
        }

        return $this->redirectToRoute('project_index');
    }
}
